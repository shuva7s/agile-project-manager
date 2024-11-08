import ErrorDiv from "@/components/shared/ErrorDiv";
import PageIntro from "@/components/shared/PageIntro";
import { getMyTasks } from "@/lib/actions/task.actions";
import { ArrowUpRight, Clock, ListTodo } from "lucide-react";
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

async function MyTasksRenderer() {
  try {
    const { success, message, tasks } = await getMyTasks();
    if (success) {
      return (
        <section className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mt-8">
          {tasks.map((task: any) => (
            <Card key={task.taskId} className="break-inside-avoid">
              <CardHeader>
                <CardTitle>{task.taskName}</CardTitle>
                <CardDescription>{task.taskDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row gap-2 items-center justify-between">
                <div className="flex flex-row gap-2 items-center text-primary">
                  <Clock /> <span>2 days</span>
                </div>
                <Link href={`/project/${task.projectId}`}>
                  <Button>
                    Visit project <ArrowUpRight />
                  </Button>
                </Link>
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
    <main>
      <PageIntro
        icon={<ListTodo className="w-8 h-8" />}
        heading="Your tasks"
        description="Tasks you are assigned will appear here"
      />
      <Suspense fallback={<MyTasksLoad />}>
        <MyTasksRenderer />
      </Suspense>
    </main>
  );
}
