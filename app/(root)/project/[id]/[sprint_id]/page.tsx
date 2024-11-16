import ErrorDiv from "@/components/shared/ErrorDiv";
import { getSprintDataBySprintId } from "@/lib/actions/sprint.actions";
import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Loader2 } from "lucide-react";
import CompletedIncompletedTab from "@/components/shared/CompletedIncompletedTab";

async function SprintAccessCheckAndRender({
  projectId,
  sprintId,
}: {
  projectId: string;
  sprintId: string;
}) {
  try {
    const { success, message, completedTasks, sprintName, incompleteTasks } =
      await getSprintDataBySprintId(projectId, sprintId);
    if (success) {
      console.dir(incompleteTasks);
      return (
        <>
          <h2 className="text-primary text-xl font-semibold text-center py-8">
            {sprintName}
          </h2>
          <Tabs defaultValue="completed">
            <div className="w-full flex justify-center items-center">
              <TabsList>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="incompleted">Incompleted</TabsTrigger>
              </TabsList>
            </div>

            <section>
              <TabsContent value="completed">
                <CompletedIncompletedTab
                  isCompleted={true}
                  tasks={completedTasks}
                />
              </TabsContent>
              <TabsContent value="incompleted">
                <CompletedIncompletedTab
                  isCompleted={false}
                  tasks={incompleteTasks}
                />
              </TabsContent>
            </section>
          </Tabs>

          <section>
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4"></div>
          </section>
        </>
      );
    } else {
      return (
        <>
          <h2 className="text-primary text-xl font-semibold text-center py-8">
            {sprintName}
          </h2>
          <ErrorDiv text={message} />
        </>
      );
    }
  } catch (error: any) {
    return (
      <>
        <ErrorDiv text={error.message} />
      </>
    );
  }
}

export default function ProjectSprintPage({
  params,
}: {
  params: {
    id: string;
    sprint_id: string;
  };
}) {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Suspense
          fallback={
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="text-primary w-10 h-10 animate-spin" />
            </div>
          }
        >
          <SprintAccessCheckAndRender
            projectId={params.id}
            sprintId={params.sprint_id}
          />
        </Suspense>
      </div>
    </>
  );
}
