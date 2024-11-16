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

const SprintsTab = ({
  projectId,
  currentSprintId,
  currentSprintName,
  sprints,
}: {
  projectId: String;
  currentSprintId: string;
  currentSprintName: string;
  sprints: any;
}) => {
  const [tab, setTab] = useState(currentSprintName);
  // console.log(tab);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="focus:outline-none py-6 sm:py-4">
          {tab}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1 max-h-[270px] overflow-y-auto">
        <DropdownMenuLabel>Select sprint</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={tab} onValueChange={setTab}>
          {sprints.map((sprint: any) => (
            <DropdownMenuRadioItem value={sprint.name} key={sprint._id}>
              <Link
                href={
                  sprint._id === currentSprintId
                    ? `/project/${projectId}`
                    : `/project/${projectId}/${sprint._id}`
                }
                className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:text-primary transition-all"
              >
                {sprint.name}
                {currentSprintId === sprint._id && (
                  <span className="text-primary"> (current)</span>
                )}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SprintsTab;
