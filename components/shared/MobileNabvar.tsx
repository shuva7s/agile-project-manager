import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Aperture, SidebarIcon } from "lucide-react";
import SideBarClient from "../client/SideBarClient";
const MobileNabvar = ({ forPc = false }: { forPc?: boolean }) => {
  return (
    <Sheet>
      <SheetTrigger
        className={`fixed left-4 bottom-4 ${
          forPc ? "" : "lg:hidden"
        }   p-2.5 lg:p-3 rounded-2xl bg-background`}
      >
        <SidebarIcon className="text-primary" />
      </SheetTrigger>
      <SheetContent className="px-0 flex flex-col gap-4" side="left">
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <SheetClose asChild>
          <Link
            href="/"
            className="flex mx-2 mt-2 py-2 items-center gap-2 text-3xl font-semibold pl-2"
          >
            <Aperture className="w-8 h-8" />
            Agile
          </Link>
        </SheetClose>

        <nav className="m-2">
          <SideBarClient isMobile={true} />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNabvar;
