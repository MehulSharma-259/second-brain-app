/** @format */

import {BrainIcon} from "../icons/BrainIcon";
import {TwitterIcon} from "../icons/TwitterIcon";
import {YoutubeIcon} from "../icons/YoutubeIcon";
import {SidebarItems} from "./SidebarItems";

export function Sidebar() {
  return (
    <>
      <div className="h-screen w-72 bg-gray-100 fixed border border-border p-2">
        <div className="flex text-3xl font-bold mb-5">
          <div className="text-blue-800 mt-1">
            <BrainIcon />
          </div>
          <div className=" mx-2">Second Brain</div>
        </div>

        <div className="text-gray-600">
          <SidebarItems text="Tweets" icon={<TwitterIcon />} />
          <SidebarItems text="Videos" icon={<YoutubeIcon />} />
        </div>
      </div>
    </>
  );
}
