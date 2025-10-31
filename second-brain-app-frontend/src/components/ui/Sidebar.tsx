/** @format */

import {BrainIcon} from "../icons/BrainIcon";
import {TwitterIcon} from "../icons/TwitterIcon";
import {YoutubeIcon} from "../icons/YoutubeIcon";
import {SidebarItems} from "./SidebarItems";
import {LogoutIcon} from "../icons/LogoutIcon"; // <-- Import new icon
import {useNavigate} from "react-router";
import axios from "axios";
import {DB_URL} from "../../../config";

export function Sidebar() {
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
        <div className="flex text-3xl font-bold mb-5">
          <div className="text-blue-800 mt-1">
            <BrainIcon />
          </div>
          <div className=" mx-2">Second Brain</div>
        </div>

        {/* Main items */}
        <div className="text-gray-600 flex-grow">
          <SidebarItems text="Tweets" icon={<TwitterIcon />} />
          <SidebarItems text="Videos" icon={<YoutubeIcon />} />
        </div>

        {/* Footer logout button */}
        <div className="text-gray-600 mb-2">
          <div onClick={handleLogout} className="cursor-pointer">
            <SidebarItems text="Logout" icon={<LogoutIcon />} />
          </div>
        </div>
      </div>
    </>
  );
}