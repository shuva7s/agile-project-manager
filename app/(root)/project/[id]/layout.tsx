import BackButton from "@/components/client/BackButton";
import SendJoinReqButton from "@/components/client/SendJoinReqButton";
import ErrorDiv from "@/components/shared/ErrorDiv";
import MobileNabvar from "@/components/shared/MobileNabvar";
import PageIntro from "@/components/shared/PageIntro";
import ProjectOptions from "@/components/shared/ProjectOptions";
import { checkUserAccessAndReturnProjectData } from "@/lib/actions/project.actions";
import { SquareChartGantt } from "lucide-react";
async function ProjectPageRenderer({ projectId }: { projectId: string }) {
  try {
    const { success, message, project, isAdmin, isMember, canSendJoinReq } =
      await checkUserAccessAndReturnProjectData(projectId);

    if (success) {
      if (!canSendJoinReq && (isMember || isAdmin)) {
        return (
          <>
            <section className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project.name}
                description={project.description}
                icon={<SquareChartGantt className="w-8 h-8 rotate-180" />}
              />
              <ProjectOptions
                projectId={projectId}
                isAdmin={isAdmin}
                memberCount={project.memberCount}
                joinRequestCount={project.joinRequestCount}
              />
            </section>

            <section>{isAdmin ? <p>admin</p> : <p>member</p>}</section>
          </>
        );
      } else {
        return (
          <>
            <section className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project!.name}
                description={project!.description}
                icon={<SquareChartGantt className="w-8 h-8 rotate-180" />}
              />
            </section>

            <section className="max-w-5xl mx-auto mt-4 min-h-[75vh] flex justify-center items-center">
              {canSendJoinReq ? (
                <SendJoinReqButton projectId={projectId} />
              ) : (
                <p className="text-muted-foreground">Join request sent</p>
              )}
            </section>
          </>
        );
      }
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    id: string;
  };
}>) {
  try {
    const { success, message, project, isAdmin, isMember, canSendJoinReq } =
      await checkUserAccessAndReturnProjectData(params.id);
    if (success) {
      if (!canSendJoinReq && (isMember || isAdmin)) {
        return (
          <main>
            <section className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project.name}
                description={project.description}
                icon={<SquareChartGantt className="w-8 h-8 rotate-180" />}
              />
              <ProjectOptions
                projectId={params.id}
                isAdmin={isAdmin}
                memberCount={project.memberCount}
                joinRequestCount={project.joinRequestCount}
              />
            </section>
            {/* <section>{isAdmin ? <p>admin</p> : <p>member</p>}</section> */}
            {children}
            <BackButton />
            <MobileNabvar forPc={true} />
          </main>
        );
      } else {
        return (
          <main>
            <section className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project!.name}
                description={project!.description}
                icon={<SquareChartGantt className="w-8 h-8 rotate-180" />}
              />
            </section>

            <section className="max-w-5xl mx-auto mt-4 min-h-[75vh] flex justify-center items-center">
              {canSendJoinReq ? (
                <SendJoinReqButton projectId={params.id} />
              ) : (
                <p className="text-muted-foreground">Join request sent</p>
              )}
            </section>
            <BackButton />
            <MobileNabvar forPc={true} />
          </main>
        );
      }
    } else {
      return (
        <main>
          <ErrorDiv text={message} />;
        </main>
      );
    }
  } catch (error: any) {
    return (
      <main>
        <ErrorDiv text={error.message} />;
      </main>
    );
  }
}
