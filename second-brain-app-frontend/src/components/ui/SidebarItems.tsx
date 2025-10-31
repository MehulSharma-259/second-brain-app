/** @format */

import type {ReactElement} from "react";

// Add isActive to props
export function SidebarItems({
  text,
  icon,
  isActive,
}: {
  text: string;
  icon: ReactElement;
  isActive: boolean;
}) {
  return (
    <>
      {/* Conditionally apply styles for the active item.
        - Active: Brighter background, primary color text, bold
        - Inactive: Default, with a hover effect
      */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-button-primary-t text-button-primary font-semibold"
            : "hover:bg-gray-200"
        }`}
      >
        <div className="mt-0.75">{icon}</div>
        <div className="mx-1">{text}</div>
      </div>
    </>
  );
}
