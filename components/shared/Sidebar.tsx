import SideBarClient from "../client/SideBarClient";
import { Aperture } from "lucide-react";
import Link from "next/link";
const Sidebar = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 left-0 overflow-y-auto flex-shrink-0 hidden lg:block px-2">
      <Link
        href="/"
        className="flex mx-2 py-4 my-4 items-center gap-2 text-3xl font-semibold pl-2"
      >
        <Aperture className="w-8 h-8" />
        Agile
      </Link>

      <nav className="">
        <SideBarClient />
      </nav>
    </aside>
  );
};

export default Sidebar;
