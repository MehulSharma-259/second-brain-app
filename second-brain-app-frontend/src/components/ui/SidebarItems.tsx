/** @format */

import type {ReactElement} from "react";

export function SidebarItems({text, icon}: {text: string; icon: ReactElement}) {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-1">
        <div className="mt-0.75">{icon}</div>
        <div className="mx-1">{text}</div>
      </div>
    </>
  );
}
