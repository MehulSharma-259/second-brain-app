import { Response, NextFunction} from "express"
import { verifyTokenUser } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../utils/interfaces.js"


export function userAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if(!token) {
    return res.status(401).json({
      message: "Sign in again"
    })
  }

  try {
    const decodedInfo = verifyTokenUser(token) as {id: string};
    req.id = decodedInfo.id;
    next();
  }catch(err: any) {
    res.status(401).json({
      message: "sign in again"
    })
  }
}