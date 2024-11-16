import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";
const CompletedIncompletedTab = ({
  isCompleted,
  tasks,
}: {
  isCompleted: boolean;
  tasks: any;
}) => {
  return (
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task: any) => (
          <Card key={task.taskId} className="break-inside-avoid">
            <CardHeader>
              <CardTitle>{task.taskName}</CardTitle>
              <CardDescription className="md:mt-1">
                {task.taskDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCompleted ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Contributers</AccordionTrigger>
                    <AccordionContent className="px-4 pb-6">
                      <div>
                        <h4 className="text-md font-semibold my-4 text-muted-foreground">
                          Designers
                        </h4>
                        <div className="flex flex-col">
                          {task.designers.map((member: any) => (
                            <div
                              key={member.username}
                              className="flex flex-row gap-2 items-center"
                            >
                              <Avatar>
                                <AvatarImage src={member.photo} />
                                <AvatarFallback>
                                  <Skeleton className="w-9 h-9" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {member.firstName !== "" &&
                                member.firstName !== "" ? (
                                  <p className="font-semibold text-primary">
                                    {member.firstName} {member.lastName}
                                  </p>
                                ) : (
                                  <p className="font-semibold text-primary">
                                    {member.username}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold my-4 text-muted-foreground">
                          Developers
                        </h4>
                        <div className="flex flex-col">
                          {task.designers.map((member: any) => (
                            <div
                              key={member.username}
                              className="flex flex-row gap-2 items-center"
                            >
                              <Avatar>
                                <AvatarImage src={member.photo} />
                                <AvatarFallback>
                                  <Skeleton className="w-9 h-9" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {member.firstName !== "" &&
                                member.firstName !== "" ? (
                                  <p className="font-semibold text-primary">
                                    {member.firstName} {member.lastName}
                                  </p>
                                ) : (
                                  <p className="font-semibold text-primary">
                                    {member.username}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold my-4 text-muted-foreground">
                          Testers
                        </h4>
                        <div className="flex flex-col">
                          {task.designers.map((member: any) => (
                            <div
                              key={member.username}
                              className="flex flex-row gap-2 items-center"
                            >
                              <Avatar>
                                <AvatarImage src={member.photo} />
                                <AvatarFallback>
                                  <Skeleton className="w-9 h-9" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {member.firstName !== "" &&
                                member.firstName !== "" ? (
                                  <p className="font-semibold text-primary">
                                    {member.firstName} {member.lastName}
                                  </p>
                                ) : (
                                  <p className="font-semibold text-primary">
                                    {member.username}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold my-4 text-muted-foreground">
                          Deployers
                        </h4>
                        <div className="flex flex-col">
                          {task.designers.map((member: any) => (
                            <div
                              key={member.username}
                              className="flex flex-row gap-2 items-center"
                            >
                              <Avatar>
                                <AvatarImage src={member.photo} />
                                <AvatarFallback>
                                  <Skeleton className="w-9 h-9" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {member.firstName !== "" &&
                                member.firstName !== "" ? (
                                  <p className="font-semibold text-primary">
                                    {member.firstName} {member.lastName}
                                  </p>
                                ) : (
                                  <p className="font-semibold text-primary">
                                    {member.username}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="w-full flex justify-end">
                  <Badge variant="outline" className="p-2">
                    {task.status === "designing" && "Designing"}
                    {task.status === "development" && "Development"}
                    {task.status === "testing" && "Tasting"}
                    {task.status === "deployment" && "Deployment"}
                  </Badge>
                </div>
              )}
            </CardContent>
            {!isCompleted && (
              <CardFooter>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Contributers</AccordionTrigger>
                    <AccordionContent className="px-4 pb-6">
                      <h4 className="text-md font-semibold my-4 text-muted-foreground">
                        {task.status === "designing" && "Designers"}
                        {task.status === "development" && "Developers"}
                        {task.status === "testing" && "Testers"}
                        {task.status === "deployment" && "Deployers"}
                      </h4>
                      <div className="flex flex-col">
                        {task.members.map((member: any) => (
                          <div
                            key={member.username}
                            className="flex flex-row gap-2 items-center"
                          >
                            <Avatar>
                              <AvatarImage src={member.photo} />
                              <AvatarFallback>
                                <Skeleton className="w-9 h-9" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {member.firstName !== "" &&
                              member.firstName !== "" ? (
                                <p className="font-semibold text-primary">
                                  {member.firstName} {member.lastName}
                                </p>
                              ) : (
                                <p className="font-semibold text-primary">
                                  {member.username}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardFooter>
            )}
          </Card>
        ))
      ) : (
        <p>No {isCompleted ? "completed" : "incompleted"} tasks</p>
      )}
    </div>
  );
};

export default CompletedIncompletedTab;
