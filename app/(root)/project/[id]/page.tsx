import EndSprint from "@/components/client/EndSprint";
import SprintsTab from "@/components/client/SprintsTab";
import StartSprint from "@/components/client/StartSprint";
import ErrorDiv from "@/components/shared/ErrorDiv";
import TaskList from "@/components/shared/TaskList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { checkUserIsAdminAndReturnCurrentSprintData } from "@/lib/actions/sprint.actions";
import { Clock, Loader2 } from "lucide-react";
import { Suspense } from "react";

async function CheckUserIsAdminOrMemberAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const {
      success,
      message,
      isAdmin,
      currentSprintId,
      currentSprintName,
      sprints,
      currentSprintData,
      canEnd,
    } = await checkUserIsAdminAndReturnCurrentSprintData(projectId);

    if (success) {
      return (
        <>
          <section className="my-4 max-w-7xl mx-auto flex justify-between items-center gap-2">
            <SprintsTab
              projectId={projectId}
              currentSprintId={currentSprintId}
              currentSprintName={currentSprintName}
              sprints={sprints}
            />
            {!currentSprintData.hasStarted && isAdmin && (
              <StartSprint projectId={projectId} />
            )}
            {currentSprintData.hasStarted &&
              !currentSprintData.hasEnded &&
              !canEnd && (
                <div className="flex flex-row gap-2 items-center">
                  <Clock className="text-primary" />
                  <span>
                    {currentSprintData.timeSpan - currentSprintData.currentTime}{" "}
                    days
                  </span>
                </div>
              )}
            {currentSprintData.hasStarted &&
              !currentSprintData.hasEnded &&
              canEnd && (
                <div className="flex flex-row gap-2 items-center">
                  <Clock className="text-primary" />
                  <span>
                    {currentSprintData.timeSpan - currentSprintData.currentTime}{" "}
                    days
                  </span>
                  <EndSprint projectId={projectId} />
                </div>
              )}
            {currentSprintData.hasStarted && currentSprintData.hasEnded && (
              <p>Sprint ended</p>
            )}
          </section>
          <section>
            <Accordion
              type="multiple"
              defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:px-4 xl:px-6"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="">
                  <p className="">Designing</p>
                </AccordionTrigger>
                <TaskList
                  isAdmin={isAdmin}
                  projectId={projectId}
                  tasks={currentSprintData.designing}
                  type="designing"
                />
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="">
                  <p className="">Development</p>
                </AccordionTrigger>
                <TaskList
                  isAdmin={isAdmin}
                  projectId={projectId}
                  tasks={currentSprintData.development}
                  type="development"
                />
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="">
                  <p className="">Testing</p>
                </AccordionTrigger>
                <TaskList
                  isAdmin={isAdmin}
                  projectId={projectId}
                  tasks={currentSprintData.testing}
                  type="testing"
                />
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="">
                  <p className="">Deployment</p>
                </AccordionTrigger>
                <TaskList
                  isAdmin={isAdmin}
                  projectId={projectId}
                  tasks={currentSprintData.deployment}
                  type="deployment"
                />
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="">
                  <p className="">Done</p>
                </AccordionTrigger>
                <TaskList
                  isAdmin={isAdmin}
                  projectId={projectId}
                  tasks={currentSprintData.completed}
                  type="done"
                />
              </AccordionItem>
            </Accordion>
          </section>
        </>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function EachProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  //First check user access again to determine if the user is admin or member and return the first tab here
  return (
    <>
      {/* <Accordion
        type="single"
        collapsible
        className="md:mx-16 my-4 mb-1"
      ></Accordion> */}

      <Suspense
        fallback={
          <section className="w-full p-8 flex justify-center items-center">
            <Loader2 className="text-primary w-10 h-10 animate-spin" />
          </section>
        }
      >
        <CheckUserIsAdminOrMemberAndRender projectId={params.id} />
      </Suspense>
    </>
  );
}
