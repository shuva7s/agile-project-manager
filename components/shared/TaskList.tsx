import { AccordionContent } from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Weitage from "./Weitage";
import { AssignMember } from "../client/AssignMember";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const TaskList = ({
  isAdmin = false,
  projectId,
  tasks,
  type,
}: {
  isAdmin?: boolean;
  projectId: string;
  tasks: any[];
  type: "designing" | "development" | "testing" | "deployment" | "done";
}) => {
  return (
    <AccordionContent className="flex flex-col gap-2">
      {tasks.length > 0 ? (
        <>
          {tasks.map((task: any) => (
            <Card key={task._id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              {/* <CardFooter className="flex justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  {task.status === "des" && (
                    <div className="flex flex-row -space-x-4">
                      {task.assignedDesigners
                        .slice(0, 3)
                        .map((designer: any) => (
                          <Avatar key={designer._id} className="w-8 h-8">
                            <AvatarImage src={designer.photo} />
                            <AvatarFallback>
                              <div className="w-8 h-8 rounded-full bg-primary/50" />
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                  )}
                  {task.status === "dev" && (
                    <div className="flex flex-row -space-x-4">
                      {task.assignedDevelopers
                        .slice(0, 3)
                        .map((developer: any) => (
                          <Avatar key={developer._id} className="w-8 h-8">
                            <AvatarImage src={developer.photo} />
                            <AvatarFallback>
                              <div className="w-8 h-8 rounded-full bg-primary/50" />
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                  )}
                  {task.assignedDesigners.length > 3 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                  {task.assignedDevelopers.length > 3 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                  <AssignMember projectId={projectId} taskId={task._id} />
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Weitage weightage={task.priority} />
                  {task.priority}
                </div>
              </CardFooter> */}
              <CardFooter className="flex justify-between gap-2">
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
                            <Avatar key={member._id} className="w-8 h-8">
                              <AvatarImage src={member.photo} />
                              <AvatarFallback>
                                <div className="w-8 h-8 rounded-full bg-primary/50" />
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {assignedArray.length > 3 && (
                            <span className="text-muted-foreground">...</span>
                          )}
                        </div>
                      )
                    );
                  })}
                  <AssignMember projectId={projectId} taskId={task._id} />
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Weitage weightage={task.priority} />
                  {task.priority}
                </div>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : (
        <div className="p-2">
          <p className="text-muted-foreground">No tasks to show</p>
        </div>
      )}
    </AccordionContent>
  );
};

export default TaskList;
