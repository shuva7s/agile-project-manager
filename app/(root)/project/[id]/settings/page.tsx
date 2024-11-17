import ErrorDiv from "@/components/shared/ErrorDiv";
import { Button } from "@/components/ui/button";
import { checkUserIsAdmin } from "@/lib/actions/project.actions";
import { CalendarPlus, Loader2 } from "lucide-react";
import { Suspense } from "react";

async function ProjectSettingsAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { isUserProjectAdmin, message } = await checkUserIsAdmin(projectId);
    if (isUserProjectAdmin) {
      return (
        <>
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h3 className="text-lg font-semibold">Add days</h3>
              <p className="text-sm text-muted-foreground">
                Add additional days to current sprint.
              </p>
            </div>
            <Button size="icon">
              <CalendarPlus />
            </Button>
          </div>
          <hr />
        </>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function ProjectSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <section className="max-w-7xl mx-auto">
        <h2 className="text-primary text-xl font-semibold py-6">
          Project settings
        </h2>

        <Suspense
          fallback={
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="text-primary w-10 h-10 animate-spin" />
            </div>
          }
        >
          <ProjectSettingsAccessCheckAndRender projectId={params.id} />
        </Suspense>
      </section>
    </>
  );
}
