import Create_update_task from "@/components/client/Create_update_task";
import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkUserIsAdminAndReturnBackLogTasks } from "@/lib/actions/project.actions";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Weitage from "@/components/shared/Weitage";

async function BackLogAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { success, message, backlogTasks } =
      await checkUserIsAdminAndReturnBackLogTasks(projectId);

    if (success) {
      return (
        <section>
          <div className="flex justify-end max-w-5xl mx-auto">
            <Create_update_task type="create" projectId={projectId} />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {backlogTasks.length > 0 ? (
              backlogTasks.map((task: any) => (
                <Card key={task._id}>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary font-semibold tracking-normal">
                      {task.name}
                    </CardTitle>
                    <CardDescription className="tracking-normal mt-0.5">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-end gap-2">
                    <Weitage weightage={task.priority} />
                    {task.priority}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No join requests</p>
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
      <div>
        <div className="text-xl my-8 max-w-5xl mx-auto">
          <p className="text-primary font-semibold">Backlogs</p>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <BackLogAccessCheckAndRender projectId={params.id} />
        </Suspense>
      </div>
    </>
  );
}
