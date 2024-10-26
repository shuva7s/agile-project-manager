import SideBarClient from "../client/SideBarClient";
import { Aperture } from "lucide-react";
import Link from "next/link";
const Sidebar = () => {
  return (
    <aside className="w-60 h-screen sticky top-0 left-0 overflow-y-auto flex-shrink-0 hidden lg:block">
      <Link
        href="/"
        className="flex mx-2 mt-2 py-2 items-center gap-2 text-3xl text-primary font-semibold pl-2"
      >
        <Aperture className="w-8 h-8" />
        Agile
      </Link>

      <nav className="m-2">
        <SideBarClient />
      </nav>
    </aside>
  );
};

export default Sidebar;
