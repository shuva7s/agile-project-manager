import ErrorDiv from "@/components/shared/ErrorDiv";
import PageIntro from "@/components/shared/PageIntro";
import { getMyTasks } from "@/lib/actions/task.actions";
import { ArrowUpRight, Clock } from "lucide-react";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Weitage from "@/components/shared/Weitage";
import MyTasksLoad from "@/components/loaders/MyTasksLoad";
import SubmitTask from "@/components/client/SubmitTask";

async function MyTasksRenderer() {
  try {
    const { success, message, tasks } = await getMyTasks();
    if (success) {
      console.dir(tasks[0]);
      return (
        <section className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 wrap">
          {tasks.map((task: any) => (
            <Card key={task.taskId} className="break-inside-avoid">
              <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex-1">
                  <CardTitle>{task.taskName}</CardTitle>
                  <CardDescription>{task.taskDescription}</CardDescription>
                </div>
                {task.remainingDays !== null && (
                  <SubmitTask
                    projectId={task.projectId}
                    taskId={task.taskId}
                    taskSubmitted={task.taskSubmitted}
                  />
                )}
              </CardHeader>
              <CardContent className="">
                <div className="flex flex-row gap-2 items-center justify-between">
                  {task.remainingDays === null ? (
                    <p className="text-muted-foreground">Not started</p>
                  ) : (
                    <div className="flex flex-row gap-2 items-center text-primary">
                      <Clock /> <span>{task.remainingDays} days</span>
                    </div>
                  )}

                  <Link href={`/project/${task.projectId}`}>
                    <Button variant="outline">
                      Visit project <ArrowUpRight />
                    </Button>
                  </Link>
                </div>
                {task.errorNote !== "" && (
                  <div className="mt-6 border border-red-500 rounded-2xl bg-destructive/50 px-4 py-2">
                    <p className="text-red-500">{task.errorNote}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <div className="flex flex-row items-center -space-x-4">
                  {task.assignedMembers.slice(0, 3).map((member: any) => (
                    <Avatar key={member.username} className="w-8 h-8">
                      <AvatarImage src={member.photo} />
                      <AvatarFallback>
                        <div className="w-8 h-8 rounded-full bg-primary/50" />
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assignedMembers.length > 3 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Weitage weightage={task.priority} />
                  {task.priority}
                </div>
              </CardFooter>
            </Card>
          ))}
        </section>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function YourTasksPage() {
  return (
    <main className="min-h-[150vh] border-l page_border">
      <PageIntro
        heading="Your tasks"
        description="Tasks you are assigned will appear here"
      />
      <hr />
      <Suspense fallback={<MyTasksLoad />}>
        <MyTasksRenderer />
      </Suspense>
    </main>
  );
}
