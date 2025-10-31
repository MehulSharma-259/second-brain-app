/** @format */

import {useRef, useState} from "react";
import {CrossIcon} from "../icons/CrossIcon";
import {Button} from "./Button";
import {Input} from "./InputBox";
import {DB_URL} from "../../../config";
import axios from "axios";

type ContentType = "youtube" | "twitter";

/**
 * Extracts a YouTube video ID from various URL formats.
 */
function getYoutubeVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Ensures a Twitter/X URL is in a valid format and extracts the tweet ID.
 * Returns the full tweet URL (NOT the embed URL)
 */
function normalizeTwitterLink(url: string): string | null {
  try {
    // Add https if not present
    const urlToProcess = url.startsWith("http") ? url : `https://${url}`;
    const parsedUrl = new URL(urlToProcess);
    
    // Check if it's twitter.com or x.com
    if (parsedUrl.hostname === "twitter.com" || 
        parsedUrl.hostname === "www.twitter.com" ||
        parsedUrl.hostname === "x.com" || 
        parsedUrl.hostname === "www.x.com") {
      
      // Extract tweet ID from the path
      // Path format: /username/status/tweetId or /i/web/status/tweetId
      const pathMatch = parsedUrl.pathname.match(/\/status\/(\d+)/);
      
      if (pathMatch && pathMatch[1]) {
        // Return the full URL (Twitter widget needs the full URL, not embed URL)
        return parsedUrl.href;
      }
    }
    return null;
  } catch (e) {
    console.error("Error parsing Twitter URL:", e);
    return null;
  }
}

export function CreateContentModal({open, onClose, onContentAdded}: any) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>("youtube");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const title = titleRef.current?.value;
    const originalLink = linkRef.current?.value;

    if (!title || !originalLink) {
      setError("Title and Link are required.");
      return;
    }

    let finalLink: string | null = null;

    if (type === "youtube") {
      const videoId = getYoutubeVideoId(originalLink);
      if (videoId) {
        finalLink = `https://www.youtube.com/embed/${videoId}`;
      } else {
        setError("Invalid YouTube URL. Please use a 'watch?v=', 'youtu.be/', or 'shorts/' link.");
        return;
      }
    } else if (type === "twitter") {
      finalLink = normalizeTwitterLink(originalLink);
      if (!finalLink) {
        setError("Invalid Twitter/X URL. Please provide a valid tweet URL (e.g., https://twitter.com/user/status/123... or https://x.com/user/status/123...)");
        return;
      }
    }

    if (!finalLink) {
      setError("An unknown error occurred with the link.");
      return;
    }

    try {
      const response = await axios.post(
        `${DB_URL}/api/v1/content`,
        {
          title,
          link: finalLink,
          type,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Content created:", response.data);
      onContentAdded();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    }
  }

  const handleClose = () => {
    setError(null);
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    onClose();
  };

  return (
    <>
      {open && (
        <div className="w-screen h-screen bg-black/70 fixed top-0 left-0 flex items-center justify-center z-50">
          <div className="flex flex-col justify-center">
            <span className="bg-white p-4 rounded-xl w-96">
              <div
                className="flex justify-end cursor-pointer"
                onClick={handleClose}
              >
                <CrossIcon />
              </div>
              <div className="flex flex-col">
                <Input placeholder="Title" reference={titleRef} />
                <Input placeholder="Link" reference={linkRef} />
              </div>

              <div className="flex gap-3 justify-center m-4">
                <div>
                  <h1>Type: </h1>
                </div>
                <Button
                  variant={type === "youtube" ? "primary" : "secondary"}
                  size="sm"
                  text="Youtube"
                  onClick={() => setType("youtube")}
                />
                <Button
                  variant={type === "twitter" ? "primary" : "secondary"}
                  size="sm"
                  text="Twitter"
                  onClick={() => setType("twitter")}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center my-2">
                  {error}
                </div>
              )}

              <div className="flex justify-center m-1">
                <Button
                  size="md"
                  variant="primary"
                  text="Submit"
                  onClick={submit}
                />
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
}