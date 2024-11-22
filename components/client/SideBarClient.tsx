"use client";
import { navLinks } from "@/const";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "../ui/sheet";

const SideBarClient = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathName = usePathname();
  if (!isMobile) {
    return (
      <ul className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <li key={link.name} className="w-full">
            <Button
              asChild
              className={`w-full justify-start rounded-2xl p-2 transition-all text-muted-foreground ${
                // (link.href === "/" && pathName === "/") ||
                // (link.href !== "/" && pathName.includes(link.href))
                link.href === pathName
                  ? "bg-primary py-7 text-primary-foreground pl-4"
                  : "bg-transparent py-7 hover:text-primary-foreground hover:pl-4"
              }`}
            >
              <Link href={link.href} className="flex gap-2">
                <link.icon />
                {link.name}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <li key={link.href} className="w-full">
            <SheetClose
              asChild
              className={`w-full flex flex-row rounded-2xl px-4 py-6 hover:bg-primary text-muted-foreground ${
                // (link.href === "/" && pathName === "/") ||
                // (link.href !== "/" && pathName.includes(link.href))
                link.href === pathName
                  ? "bg-primary py-6 text-white"
                  : "bg-transparent py-6 hover:text-white"
              }`}
            >
              <Link href={link.href} className="flex gap-2">
                <link.icon />
                {link.name}
              </Link>
            </SheetClose>
          </li>
        ))}
      </ul>
    );
  }
};

export default SideBarClient;
