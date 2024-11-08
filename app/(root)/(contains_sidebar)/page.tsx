import Create_update_project from "@/components/client/Create_update_project";
import PageIntro from "@/components/shared/PageIntro";
import ProjectsContainerRenderer from "@/components/shared/ProjectsContainerRenderer";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Grid2x2Check } from "lucide-react";
import Link from "next/link";

export default async function Homepage() {
  return (
    <>
      <SignedIn>
        <main className="min-h-[150vh]">
          <PageIntro
            icon={<Grid2x2Check className="w-8 h-8" />}
            heading="Your projects"
            description="Projects created by you"
          />
          <div className="w-full flex justify-end">
            <Create_update_project type="create" />
          </div>

          {/* <ProjectsContainerRenderer getHosted={true} /> */}
        </main>
      </SignedIn>
      <SignedOut>
        <main className="w-full min-h-screen flex flex-col gap-4 justify-center items-center">
          <h1 className="text-3xl text-muted-foreground">
            You are missing out
          </h1>
          <Button asChild>
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
        </main>
      </SignedOut>
    </>
  );
}
