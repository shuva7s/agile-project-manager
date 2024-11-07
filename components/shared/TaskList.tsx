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
              <CardFooter className="flex justify-between gap-2">
                <AssignMember projectId={projectId} taskId={task._id} />
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
