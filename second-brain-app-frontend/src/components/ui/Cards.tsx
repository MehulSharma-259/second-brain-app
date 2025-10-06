/** @format */

import {TextIcon} from "../icons/TextIcon";
import {ShareIcon} from "../icons/ShareIcon";
import {DeleteIcon} from "../icons/DeleteIcon";
import axios from "axios";
import {DB_URL} from "../../../config";

export interface CardProps {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Cards({_id, title, link, type}: CardProps) {
  async function deleteCard() {
    const res = await axios.delete(`${DB_URL}/api/v1/content`, {
      data: {contentId: _id},
      withCredentials: true,
    });

    console.log("ye hai es");
  }

  return (
    <>
      <div className="bg-white max-w-64 min-h-72 rounded-2xl shadow-xl border-1 border-border">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <div className="text-all-t">
                <TextIcon />
              </div>
              <h1 className="font-medium">{title}</h1>
            </div>

            <div className="flex gap-1 items-center text-all-t">
              <a href={link} target="_blank">
                <ShareIcon />
              </a>
              <div className="cursor-pointer" onClick={deleteCard}>
                <DeleteIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="py-2 px-2">
          {type === "youtube" && (
            <iframe
              className="w-full"
              src={link.replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            <>
              <blockquote className="twitter-tweet">
                <a href={link}></a>
                <script
                  async
                  src="https://platform.twitter.com/widgets.js"
                ></script>
              </blockquote>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
}
