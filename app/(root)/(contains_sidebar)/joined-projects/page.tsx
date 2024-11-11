import PageIntro from "@/components/shared/PageIntro";
import ProjectsContainerRenderer from "@/components/shared/ProjectsContainerRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function JoinedProjects() {
  return (
    <main className="min-h-[150vh] border-l page_border">
      <PageIntro
        heading="Joined projects"
        description="Projects joined by you"
      />
      <div className="w-full flex justify-end pt-4 sm:pt-0 wrap">
        <Button asChild className="rounded-2xl w-full sm:w-fit py-6 sm:py-4">
          <Link href="/join-project">Join project</Link>
        </Button>
      </div>

      <hr />

      <ProjectsContainerRenderer getHosted={false} />
    </main>
  );
}
