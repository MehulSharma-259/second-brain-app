/** @format */

import {useRef, useState} from "react";
import {CrossIcon} from "../icons/CrossIcon";
import {Button} from "./Button";
import {Input} from "./InputBox";
import {DB_URL} from "../../../config";
import axios from "axios";

type ContentType = "youtube" | "twitter";

export function CreateContentModal({open, onClose}: any) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>("youtube");

  async function submit() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    
    try {
      const response = await axios.post(
        `${DB_URL}/api/v1/content`,
        {
          title,
          link,
          type,
        },
        {
          withCredentials: true,
        }
      );
      alert(response.statusText)
      onClose()
      
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <>
      {open && (
        <div className="w-screen h-screen bg-black/70 fixed top-0 left-0 flex items-center justify-center ">
          <div className="flex flex-col justify-center ">
            <span className="bg-white p-4 rounded-xl">
              <div
                className="flex justify-end cursor-pointer"
                onClick={onClose}
              >
                <CrossIcon />
              </div>
              <div className="flex flex-col justify-center items-center"></div>
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
                  onClick={() => {
                    setType("youtube");
                  }}
                />
                <Button
                  variant={type === "twitter" ? "primary" : "secondary"}
                  size="sm"
                  text="Twitter"
                  onClick={() => {
                    setType("twitter");
                  }}
                />
              </div>

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
