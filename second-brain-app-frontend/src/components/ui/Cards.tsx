/** @format */

import {TextIcon} from "../icons/TextIcon";
import {ShareIcon} from "../icons/ShareIcon";
import {DeleteIcon}from "../icons/DeleteIcon";
import axios from "axios";
import {DB_URL} from "../../../config";
// import { useEffect } from "react"; // <-- REMOVE this import

export interface CardProps {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  onDelete: () => void;
}

// We can remove the window.twttr declaration, as it's now in Dashboard.tsx
// declare global {
//   ...
// }

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

  // --- REMOVED useEffect for Twitter embeds ---
  // The Dashboard component will now handle this.

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
              <a href={link} target="_blank" rel="noopener noreferrer">
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
              src={link} 
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {/* This JSX remains the same. The useEffect in Dashboard will find this. */}
          {type === "twitter" && (
            <div className="px-2 min-h-[200px]"> 
              <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                <a href={link}>Loading Tweet...</a>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </>
  );
}