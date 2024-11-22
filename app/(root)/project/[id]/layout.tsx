import BackButton from "@/components/client/BackButton";
import SendJoinReqButton from "@/components/client/SendJoinReqButton";
import ErrorDiv from "@/components/shared/ErrorDiv";
import MobileNabvar from "@/components/shared/MobileNabvar";
import PageIntro from "@/components/shared/PageIntro";
import ProjectOptions from "@/components/shared/ProjectOptions";
import { checkUserAccessAndReturnProjectData } from "@/lib/actions/project.actions";
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
        // console.dir(project);
        return (
          <main className="wrap pb-16">
            <section className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project.name}
                description={project.description}
                nowrap={true}
              />
              <ProjectOptions
                projectId={params.id}
                isAdmin={isAdmin}
                memberCount={project.memberCount}
                joinRequestCount={project.joinRequestCount}
                backlogTaskCount={project.backlogTaskCount}
                submissionCount={project.submissionCount}
              />
            </section>
            <hr className="max-w-7xl mx-auto" />
            {children}
            <BackButton />
            <MobileNabvar forPc={true} />
          </main>
        );
      } else {
        return (
          <main>
            <section className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between">
              <PageIntro
                heading={project!.name}
                description={project!.description}
              />
            </section>

            <section className="max-w-7xl mx-auto mt-4 min-h-[75vh] flex justify-center items-center">
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
          <ErrorDiv text={message} />
        </main>
      );
    }
  } catch (error: any) {
    return (
      <main>
        <ErrorDiv text={error.message} />
      </main>
    );
  }
}
