/** @format */

import {BrainIcon} from "../icons/BrainIcon";
import {TwitterIcon} from "../icons/TwitterIcon";
import {YoutubeIcon} from "../icons/YoutubeIcon";
import {SidebarItems} from "./SidebarItems";
import {LogoutIcon} from "../icons/LogoutIcon";
import {useNavigate} from "react-router";
import axios from "axios";
import {DB_URL} from "../../../config";
import { HomeIcon } from "../icons/HomeIcon"; // Import new HomeIcon
import type { ContentFilter } from "../../pages/Dashboard"; // Import the type

// Update props to accept filter state and setter
export function Sidebar({
  filter,
  setFilter,
}: {
  filter: ContentFilter;
  setFilter: (filter: ContentFilter) => void;
}) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axios.post(
        `${DB_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/signin"); // Redirect to signin on successful logout
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <>
      <div className="h-screen w-72 bg-gray-100 fixed border border-border p-2 flex flex-col">
        <div className="flex text-3xl font-bold mb-5 p-2">
          <div className="text-blue-800 mt-1">
            <BrainIcon />
          </div>
          <div className=" mx-2">Second Brain</div>
        </div>

        {/* Main items - now clickable and aware of active state */}
        <div className="text-gray-600 flex-grow px-2">
          <div onClick={() => setFilter("all")} className="cursor-pointer">
            <SidebarItems 
              text="All Content" 
              icon={<HomeIcon />} 
              isActive={filter === "all"} 
            />
          </div>
          <div onClick={() => setFilter("twitter")} className="cursor-pointer">
            <SidebarItems
              text="Tweets"
              icon={<TwitterIcon />}
              isActive={filter === "twitter"}
            />
          </div>
          <div onClick={() => setFilter("youtube")} className="cursor-pointer">
            <SidebarItems
              text="Videos"
              icon={<YoutubeIcon />}
              isActive={filter === "youtube"}
            />
          </div>
        </div>

        {/* Footer logout button */}
        <div className="text-gray-600 mb-2 px-2">
          <div onClick={handleLogout} className="cursor-pointer">
            {/* Pass isActive as false for logout */}
            <SidebarItems text="Logout" icon={<LogoutIcon />} isActive={false} />
          </div>
        </div>
      </div>
    </>
  );
}
