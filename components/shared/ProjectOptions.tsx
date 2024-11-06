import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";

const ProjectOptions = ({
  projectId,
  isAdmin,
  memberCount,
  joinRequestCount,
  backlogTaskCount,
}: {
  projectId: string;
  isAdmin: boolean;
  memberCount: number;
  joinRequestCount?: number;
  backlogTaskCount?: number;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="mt-4 rounded-2xl focus:outline-none py-6 sm:py-4">
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-muted-foreground w-44">
        <DropdownMenuLabel className="text-primary px-4 py-3">
          Project options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          <Link
            className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:bg-accent hover:text-primary transition-all"
            href={`/project/${projectId}/members`}
          >
            Members <span className="text-primary">{memberCount}</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:bg-accent hover:text-primary transition-all"
                href={`/project/${projectId}/join-requests`}
              >
                Join requests{" "}
                <span className="text-primary">{joinRequestCount}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:bg-accent hover:text-primary transition-all"
                href={`/project/${projectId}/backlog`}
              >
                Backlog{" "}
                <span className="text-primary">{backlogTaskCount}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:bg-accent hover:text-primary transition-all"
                href={`/project/${projectId}/submissions`}
              >
                Submissions <span className="text-primary">0</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="w-full h-ful px-2 hover:px-4 py-3 rounded-lg hover:bg-accent hover:text-primary transition-all"
                href={`/project/${projectId}/settings`}
              >
                Settings
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectOptions;
