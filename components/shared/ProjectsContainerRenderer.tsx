import { getProjects } from "@/lib/actions/project.actions";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProjectsContainerLoader from "../loaders/ProjectsContainerLoader";
import Link from "next/link";
import { Button } from "../ui/button";
import { Chart } from "../client/Chart";
import ErrorDiv from "./ErrorDiv";
import Image from "next/image";
import Create_update_project from "../client/Create_update_project";
async function ProjectsContainer({ getHosted = true }) {
  try {
    const { success, projects } = await getProjects(getHosted);
    // console.dir(projects);
    if (success && projects && projects.length > 0) {
      return (
        <section className="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4 mt-4 wrap">
          {projects.map((project: any) => (
            <Card key={project._id} className="break-inside-avoid">
              <Link href={`/project/${project._id}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground/80">
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {project.hasStarted ? (
                    <Chart
                      total={project.totalTasks}
                      completed={project.completedTasks}
                    />
                  ) : (
                    <div className="min-h-44 flex justify-center items-center">
                      <p className="text-muted-foreground">Not started yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center text-muted-foreground pb-4 flex-wrap">
                  <Button
                    asChild
                    variant="ghost"
                    className="pl-0 hover:pl-4 transition-all"
                  >
                    <Link href={`/project/${project._id}/members`}>
                      <span className="text-primary">
                        {project.memberCount}{" "}
                      </span>
                      <span>
                        {project.memberCount === 1 ? "member" : "members"}
                      </span>
                    </Link>
                  </Button>
                  {getHosted && (
                    <Button
                      asChild
                      variant="ghost"
                      className="pr-0 hover:pr-4 transition-all"
                    >
                      <Link href={`/project/${project._id}/join-requests`}>
                        <span className="text-primary">
                          {project.joinRequestCount}{" "}
                        </span>
                        <span>
                          {project.joinRequestCount <= 1
                            ? "Join request"
                            : "Join requests"}
                        </span>
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Link>
            </Card>
          ))}
        </section>
      );
    } else {
      return (
        <section className="min-h-[75vh] flex flex-col justify-center items-center overflow-x-hidden">
          {getHosted ? (
            <>
              <Image
                src="/yourProject.png"
                width={400}
                height={400}
                alt="yourProject"
                className="translate-x-[4%] lg:translate-x-[5%]"
                priority={true}
                draggable={false}
              />
              <Create_update_project type="create" first={true} />
            </>
          ) : (
            <>
              <Image
                src="/joinProject.png"
                width={400}
                height={400}
                alt="joinProject"
                className="translate-x-[4%] lg:translate-x-[5%]"
                priority={true}
                draggable={false}
              />
              <Button asChild className="rounded-2xl" variant="ghost">
                <Link href="/join-project">Join your first project</Link>
              </Button>
            </>
          )}
        </section>
      );
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

const ProjectsContainerRenderer = ({
  getHosted = true,
}: {
  getHosted: boolean;
}) => {
  return (
    <Suspense fallback={<ProjectsContainerLoader />}>
      <ProjectsContainer getHosted={getHosted} />
    </Suspense>
  );
};

export default ProjectsContainerRenderer;
