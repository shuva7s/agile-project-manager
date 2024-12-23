import Create_update_project from "@/components/client/Create_update_project";
import Hero from "@/components/Hero/Hero";
import PageIntro from "@/components/shared/PageIntro";
import ProjectsContainerRenderer from "@/components/shared/ProjectsContainerRenderer";
import { SignedIn, SignedOut } from "@clerk/nextjs";

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
        <main className="py-0">
          <Hero />
        </main>
      </SignedOut>
    </>
  );
}
