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
  onDelete: () => void;
}

export function Cards({_id, title, link, type, onDelete}: CardProps) {
  
  async function deleteCard() {
    try {
      const res = await axios.delete(`${DB_URL}/api/v1/content`, {
        data: {contentId: _id},
        withCredentials: true,
      });
      console.log("Deleted:", res.data.record);
      onDelete(); 
    } catch (err: any) {
      console.error("Failed to delete card:", err.message);
      alert("Failed to delete. Please try again.");
    }
  }

  return (
    <>
      {/* CLEANUP: 
        1. Changed 'max-w-64' to 'w-full max-w-xs' (320px) for more space.
        2. Changed 'shadow-xl' to 'shadow-lg' for a softer look.
        3. Added 'overflow-hidden' to ensure content respects the rounded corners.
      */}
      <div className="bg-white w-full max-w-xs min-h-72 rounded-2xl shadow-lg border-1 border-border overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center overflow-hidden">
              <div className="text-all-t flex-shrink-0">
                <TextIcon />
              </div>
              <h1 className="font-medium truncate" title={title}>{title}</h1>
            </div>

            <div className="flex gap-1 items-center text-all-t flex-shrink-0">
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-button-primary transition-colors">
                <ShareIcon />
              </a>
              <div className="cursor-pointer hover:text-red-500 transition-colors" onClick={deleteCard}>
                <DeleteIcon />
              </div>
            </div>
          </div>
        </div>

        {/* CLEANUP: 
          1. Changed padding from 'py-2 px-2' to 'px-4 pb-4' to match header and give space.
        */}
        <div className="px-4 pb-4">
          {type === "youtube" && (
            <iframe
              /*
                CLEANUP: 
                1. Added 'rounded-lg' to match the card's border radius.
              */
              className="w-full aspect-video rounded-lg"
              src={link} 
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            /*
              CLEANUP: 
              1. Removed 'px-2' as parent now handles padding.
              2. Increased 'max-h-[300px]' to 'max-h-[400px]' for better viewing.
            */
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
              <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                <a href={link.replace('x.com', 'twitter.com')}>Loading Tweet...</a>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

