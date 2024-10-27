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
async function ProjectsContainer({ getHosted = true }) {
  try {
    const { success, projects } = await getProjects(getHosted);
    if (success && projects && projects.length > 0) {
      return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {projects.map((project: any) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle className="text-foreground/80">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="min-h-40 flex justify-center items-center text-muted-foreground">
                <p>Card Content</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-muted-foreground pb-4">
                <Button asChild variant="ghost" className="pl-0 hover:pl-4 transition-all">
                  <Link href={""}>
                    <span className="text-primary">{project.memberCount} </span>
                    <span>
                      {project.memberCount === 1 ? "member" : "members"}
                    </span>
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="pr-0 hover:pr-4 transition-all">
                  <Link href={""}>
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
              </CardFooter>
            </Card>
            // <div key={project._id}>
            //   {/* Make sure to add a key */}
            //   <p>{project.name}</p>
            //   <p>{project.description}</p>
            // </div>
          ))}
        </section>
      );
    } else {
      return <p>No projects to show</p>;
    }
  } catch (error: any) {
    return (
      <div className="text-red-500 bg-destructive/50 p-6 border border-destructive rounded-2xl">
        {error.message}
      </div>
    );
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
