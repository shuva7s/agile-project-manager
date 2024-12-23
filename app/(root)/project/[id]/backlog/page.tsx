import Create_update_task from "@/components/client/Create_update_task";
import ErrorDiv from "@/components/shared/ErrorDiv";
import { Suspense } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Weitage from "@/components/shared/Weitage";
import { checkUserIsAdminAndReturnBackLogTasks } from "@/lib/actions/task.actions";
import BacklogLoader from "@/components/loaders/BacklogLoader";
import PushToDes from "@/components/client/PushToDes";
import { Badge } from "@/components/ui/badge";
import DeleteTask from "@/components/client/DeleteTask";

async function BackLogAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { success, message, backlogTasks } =
      await checkUserIsAdminAndReturnBackLogTasks(projectId);
    if (success) {
      // console.log(backlogTasks);
      return (
        <section>
          <div className="flex justify-end max-w-7xl mx-auto">
            <Create_update_task type="create" projectId={projectId} />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {backlogTasks.length > 0 ? (
              backlogTasks.map((task: any) => (
                <Card key={task._id} className="flex flex-col justify-between">
                  <CardHeader className="flex flex-row flex-wrap">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary font-semibold tracking-normal">
                        {task.name}
                      </CardTitle>
                      <CardDescription className="tracking-normal mt-0.5">
                        {task.description}
                      </CardDescription>
                    </div>
                    {task.status !== "com" && (
                      <div className="flex gap-2 text-foreground/50">
                        <Create_update_task
                          type="update"
                          projectId={projectId}
                          taskId={task._id}
                          name={task.name}
                          description={task.description}
                          priority={task.priority}
                        />
                        <DeleteTask projectId={projectId} taskId={task._id} />
                      </div>
                    )}
                  </CardHeader>
                  <CardFooter className="flex justify-between gap-2">
                    {task.status === "ns" ? (
                      <PushToDes projectId={projectId} taskId={task._id} />
                    ) : (
                      <Badge
                        className="px-2 py-1.5"
                        variant={
                          task.status === "com" ? "default" : "secondary"
                        }
                      >
                        {task.status === "des" && "Designing"}
                        {task.status === "dev" && "Development"}
                        {task.status === "tes" && "Testing"}
                        {task.status === "dep" && "Deploying"}
                        {task.status === "com" && "Completed"}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5 justify-center">
                      <Weitage weightage={task.priority} />
                      {task.priority}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No tasks to show</p>
            )}
          </div>
        </section>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function ProjectBacklogPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mt-8 mb-8 sm:mb-0">
          <h2 className="text-primary text-2xl font-medium">Backlogs</h2>
          <p className="text-muted-foreground">Add all tasks here.</p>
        </div>
        <Suspense fallback={<BacklogLoader />}>
          <BackLogAccessCheckAndRender projectId={params.id} />
        </Suspense>
      </div>
    </>
  );
}
