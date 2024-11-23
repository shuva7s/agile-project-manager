import AddDays from "@/components/client/AddDays";
import Create_update_project from "@/components/client/Create_update_project";
import DeleteProject from "@/components/client/DeleteProject";
import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkUserIsAdmin } from "@/lib/actions/project.actions";
import { Loader2, Pencil } from "lucide-react";
import { Suspense } from "react";

async function ProjectSettingsAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { isUserProjectAdmin, message, name, description } =
      await checkUserIsAdmin(projectId);
    if (isUserProjectAdmin) {
      return (
        <>
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h3 className="text-lg font-semibold">Edit project info</h3>
              <p className="text-sm text-muted-foreground">
                Edit project name, description.
              </p>
            </div>
            <Create_update_project
              type="update"
              id={projectId}
              name={name}
              description={description}
            />
          </div>
          <hr />
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h3 className="text-lg font-semibold">Add days</h3>
              <p className="text-sm text-muted-foreground">
                Add additional days to current sprint.
              </p>
            </div>
            <AddDays projectId={projectId} />
          </div>
          <hr />
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h3 className="text-lg font-semibold text-destructive">
                Delete project
              </h3>
              <p className="text-sm text-destructive/80">
                Delete project permanently.
              </p>
            </div>
            <DeleteProject projectId={projectId} />
          </div>
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
        <div className="my-8">
          <h2 className="text-primary text-2xl font-medium">
            Project settings
          </h2>
          <p className="text-muted-foreground">Change project settings</p>
        </div>

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
