import Create_update_project from "@/components/client/Create_update_project";
import PageIntro from "@/components/shared/PageIntro";
import ProjectsContainerRenderer from "@/components/shared/ProjectsContainerRenderer";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default async function Homepage() {
  return (
    <>
      <SignedIn>
        <main className="min-h-[100vh] border-l page_border">
          <PageIntro
            heading="Your projects"
            description="Projects created by you"
          />

          <div className="w-full flex justify-end pt-4 sm:pt-0 wrap">
            <Create_update_project type="create" />
          </div>

          <hr />

          <ProjectsContainerRenderer getHosted={true} />
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
