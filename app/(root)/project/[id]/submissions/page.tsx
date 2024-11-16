import { checkUserIsAdminAndReturnSubmittedTasks } from "@/lib/actions/task.actions";
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
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ErrorDiv from "@/components/shared/ErrorDiv";
import MyTasksLoad from "@/components/loaders/MyTasksLoad";
import AccOrRejTask from "@/components/client/AccOrRejTask";

async function SubmissionsAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { success, message, remainingDays, submittedTasks } =
      await checkUserIsAdminAndReturnSubmittedTasks(projectId);

    if (success) {
      return (
        <section>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submittedTasks.length > 0 ? (
              submittedTasks.map((task: any) => (
                <Card key={task._id} className="flex flex-col justify-between">
                  <CardHeader className="w-full flex flex-row justify-between items-start flex-wrap">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary font-semibold tracking-normal">
                        {task.name}
                      </CardTitle>
                      <CardDescription className="tracking-normal mt-0.5">
                        {task.description}
                      </CardDescription>
                    </div>
                    <Badge
                      className="p-2 flex-shrink-0"
                      variant={task.status === "com" ? "default" : "secondary"}
                    >
                      {task.status === "des" && "Designing"}
                      {task.status === "dev" && "Development"}
                      {task.status === "tes" && "Testing"}
                      {task.status === "dep" && "Deploying"}
                      {task.status === "com" && "Completed"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="w-full flex flex-row justify-between flex-wrap items-center">
                    <div className="flex flex-row items-center gap-2">
                      {["des", "dev", "tes", "dep"].map((status) => {
                        const assignedArray =
                          status === "des"
                            ? task.assignedDesigners
                            : status === "dev"
                            ? task.assignedDevelopers
                            : status === "tes"
                            ? task.assignedTesters
                            : task.assignedDeployers;

                        return (
                          task.status === status && (
                            <div
                              className="flex flex-row items-center -space-x-4"
                              key={status}
                            >
                              {assignedArray.slice(0, 3).map((member: any) => (
                                <Avatar key={member._id} className="w-9 h-9">
                                  <AvatarImage src={member.photo} />
                                  <AvatarFallback>
                                    <div className="w-8 h-8 rounded-full bg-primary/50" />
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {assignedArray.length > 3 && (
                                <span className="text-muted-foreground">
                                  ...
                                </span>
                              )}
                            </div>
                          )
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Weitage weightage={task.priority} />
                      {task.priority}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between flex-wrap items-center">
                    {remainingDays && (
                      <div className="flex flex-row gap-2 items-center text-primary">
                        <Clock /> <span>{remainingDays} days</span>
                      </div>
                    )}

                    <div className="flex flex-row gap-2 flex-wrap">
                      <AccOrRejTask projectId={projectId} taskId={task._id} />
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

const SubmissionsPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="my-8 max-w-5xl mx-auto text-center">
          <h2 className="text-primary text-xl font-semibold">Submissions</h2>
          <p className="text-muted-foreground">
            View and manage all submissions here.
          </p>
        </div>
        <Suspense fallback={<MyTasksLoad />}>
          <SubmissionsAccessCheckAndRender projectId={params.id} />
        </Suspense>
      </div>
    </>
  );
};

export default SubmissionsPage;
