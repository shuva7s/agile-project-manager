import BackButton from "@/components/client/BackButton";
import ProjectPageLoader from "@/components/loaders/ProjectPageLoader";
import ErrorDiv from "@/components/shared/ErrorDiv";
import PageIntro from "@/components/shared/PageIntro";
import ProjectOptions from "@/components/shared/ProjectOptions";
import { checkUserAccessAndReturnProjectData } from "@/lib/actions/project.actions";
import { SquareChartGantt } from "lucide-react";
import { Suspense } from "react";

async function ProjectPageRenderer({ projectId }: { projectId: string }) {
  try {
    const { success, message, project, isAdmin, isMember } =
      await checkUserAccessAndReturnProjectData(projectId);
    if (success) {
      return (
        <>
          <section className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between">
            <PageIntro
              heading={project!.name}
              description={project!.description}
              icon={<SquareChartGantt className="w-8 h-8 rotate-180" />}
            />
            <ProjectOptions
              projectId={projectId}
              isAdmin={isAdmin!}
              memberCount={project!.memberCount}
              joinRequestCount={project!.joinRequestCount}
            />
          </section>
        </>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function EachProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <main>
      <Suspense fallback={<ProjectPageLoader />}>
        <ProjectPageRenderer projectId={params.id} />
      </Suspense>
      <BackButton />
    </main>
  );
}
