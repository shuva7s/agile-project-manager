import { AccordionContent } from "../ui/accordion";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Weitage from "./Weitage";
import { AssignMember } from "../client/AssignMember";
import MembersAndRemove from "../client/MembersAndRemove";

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
                      task.status === status &&
                      assignedArray.length > 0 && (
                        <MembersAndRemove
                          key={status} // Add a unique key here for each "MembersAndRemove"
                          isAdmin={isAdmin}
                          taskSubmitted={task.isSubmitted}
                          projectId={projectId}
                          taskId={task._id}
                          assignedPeople={assignedArray}
                        />
                      )
                    );
                  })}

                  {isAdmin && task.status !== "com" && !task.isSubmitted && (
                    <AssignMember
                      key="assign"
                      projectId={projectId}
                      taskId={task._id}
                    />
                  )}
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
