import PageIntro from "@/components/shared/PageIntro";
import ProjectsContainerRenderer from "@/components/shared/ProjectsContainerRenderer";
import { Button } from "@/components/ui/button";
import { Blocks } from "lucide-react";
import Link from "next/link";
export default async function JoinedProjects() {
  return (
    <main className="min-h-[150vh]">
      <PageIntro
        icon={<Blocks className="w-8 h-8" />}
        heading="Joined projects"
        description="Projects joined by you"
      />
      <div className="w-full flex justify-end">
        <Button
          asChild
          className="rounded-2xl w-full sm:w-fit py-6 sm:py-4 mt-4 sm:mt-0"
        >
          <Link href="/join-project">Join project</Link>
        </Button>
      </div>

      <ProjectsContainerRenderer getHosted={false} />
    </main>
  );
}
