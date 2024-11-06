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

const TaskList = ({
  isAdmin = false,
  tasks,
  type,
}: {
  isAdmin?: boolean;
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
                <div className="w-10 h-10 rounded-full bg-primary/20"/>
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
