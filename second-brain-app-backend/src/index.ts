/** @format */

import express from "express";
import {z} from "zod";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import {connection} from "./utils/dbConnection.js";
import {ContentModel, LinkModel, UserModel} from "./db.js";
import {
  verifyTokenAdmin,
  verifyTokenUser,
  signTokenAdmin,
  signTokenUser,
} from "./utils/jwt.js";
import {userAuth} from "./middlewares/auth.js";
import {Request, Response, NextFunction} from "express";
import {AuthenticatedRequest} from "./utils/interfaces.js";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";

const app = express();
connection(process.env.MONGO_URL!);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // allow cookies
  })
);

// ... (signup and signin routes remain the same) ...

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const requiredBody = z.object({
    firstName: z.string().min(5, "First name must be at least 5 characters").max(50),
    lastName: z.string().min(5, "Last name must be at least 5 characters").max(50),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[@$!%*?&^#()[\]{}\-_=+<>]/, "Password must contain at least one special character"),
  });

  const validateData = requiredBody.safeParse(req.body);

  if (!validateData.success) {
    // Return the first validation error message
    return res.status(411).json({
      message: validateData.error.issues[0]?.message || "Invalid input",
    });
  }

  const {lastName, firstName, email, password} = validateData.data;
  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        message: "User with this email already exists."
      });
    }

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = signTokenUser({id: user._id});

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", 
    });

    return res.status(200).json({
      message: "signed up",
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const {email, password} = req.body;
  try {
    const user = await UserModel.findOne({email});
    if (user) {
      const samePassword = await bcrypt.compare(password, user.password);
      if (samePassword) {
        const token = signTokenUser({id: user._id});

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
        });

        return res.status(200).json({
          message: "successfully signed in",
        });
      } else {
        res.status(403).json({
          message: "Invalid email or password",
        });
      }
    } else {
      // Added else block for user not found
      res.status(403).json({
        message: "Invalid email or password",
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// --- NEW LOGOUT ENDPOINT ---
app.post("/api/v1/logout", (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out" });
});
// --- END NEW ENDPOINT ---

app.post(
  "/api/v1/content",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    // Add validation for content
    const contentBody = z.object({
      // We validate the URL on the frontend now, so just check for a string
      link: z.string().min(1, "Link cannot be empty"), 
      type: z.enum(["youtube", "twitter"]),
      title: z.string().min(1, "Title cannot be empty").max(100),
    });

    const validateData = contentBody.safeParse(req.body);

    if (!validateData.success) {
      return res.status(411).json({
        message: validateData.error.issues[0]?.message || "Invalid input",
      });
    }

    const {link, type, title} = validateData.data;
    try {
      const newContent = await ContentModel.create({
        userId: req.id,
        link,
        type,
        title,
        tags: [],
      });

      return res.status(200).json({
        message: "content created",
        content: newContent // Return the new content
      });
    } catch (err: any) {
      // Check for duplicate key error (link or title)
      if (err.code === 11000) {
        return res.status(400).json({
          message: "This link or title already exists in your brain."
        });
      }
      return res.status(400).json({
        message: err.message || "Failed to create content",
      });
    }
  }
);

// ... (rest of the file remains the same) ...

app.get(
  "/api/v1/content",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.id;

    try {
      const contents = await ContentModel.find({userId: id}).populate(
        "userId",
        "email"
      );

      return res.json({
        contents,
      });
    } catch (err: any) {
      return res.status(400).json({
        message: "something went wrong",
      });
    }
  }
);

app.delete(
  "/api/v1/content",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.id;
    const contentId = req.body.contentId;

    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    try {
      const deletedRecord = await ContentModel.findOneAndDelete({
        _id: contentId,
        userId: id,
      });

      if (!deletedRecord) {
        return res.status(404).json({ message: "Content not found or you don't have permission" });
      }

      return res.status(200).json({
        message: "record deleted",
        record: deletedRecord,
      });
    } catch (err: any) {
      return res.json({
        message: "something went wrong",
      });
    }
  }
);

app.post(
  "/api/v1/brain/share",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const share = req.body.share;
    const id = req.id;

    if (share) {
      const hash = crypto.randomBytes(10).toString("hex");

      try {
        const existingLink = await LinkModel.findOne({
          userId: id,
        });

        if (existingLink) {
          return res.json({
            message: "link already exists",
            visitLink: existingLink.hash,
          });
        }

        const link = await LinkModel.create({
          userId: id,
          hash,
        });

        return res.json({
          message: "link created",
          visitLink: link.hash,
        });
      } catch (err: any) {
        return res.json({
          message: err.message,
        });
      }
    } else {
      try {
        const deletedLink = await LinkModel.findOneAndDelete({
          userId: id,
        });

        return res.json({
          message: "deleted content",
        });
      } catch (err: any) {
        return res.json({
          message: err.message,
        });
      }
    }
  }
);

app.get(
  "/api/v1/brain/:shareLink",
  async (req: AuthenticatedRequest, res: Response) => {
    const hash = req.params.shareLink;
    try {
      const link = await LinkModel.findOne({
        hash,
      });

      if (!link) {
        return res.json({
          message: "invalid link",
        });
      }

      const content = await ContentModel.find({
        userId: link.userId,
      }).populate("userId", "firstName email");

      return res.json({
        records: content,
      });
    } catch (err: any) {
      return res.json({
        message: err.message,
      });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});