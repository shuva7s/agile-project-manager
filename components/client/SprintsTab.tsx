"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SprintsTab = ({ sprints }: { sprints?: any[] }) => {
  const [position, setPosition] = useState("top");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="focus:outline-none py-6 sm:py-4"
        >
          {position}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1">
        <DropdownMenuLabel>Select sprint</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">
            <Link
              href="/"
              className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:text-primary transition-all"
            >
              Top {"(current)"}
            </Link>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">
            <Link
              href="/"
              className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:text-primary transition-all"
            >
              Bottom
            </Link>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">
            <Link
              href="/"
              className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:text-primary transition-all"
            >
              Right
            </Link>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="left">
            <Link
              href="/"
              className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:text-primary transition-all"
            >
              Left
            </Link>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SprintsTab;
