import AddSprint from "@/components/client/AddSprint";
import ErrorDiv from "@/components/shared/ErrorDiv";
import { AddSprintAccessChecker } from "@/lib/actions/sprint.actions";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

async function AddSprintAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { success, message } = await AddSprintAccessChecker(projectId);
    if (success) {
      return (
        <section className="min-h-[60vh] w-full flex justify-center items-center">
          <AddSprint projectId={projectId} />
        </section>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function addSprintPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="my-8 max-w-5xl mx-auto text-center">
          <h2 className="text-primary text-xl font-semibold">Add sprint</h2>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="text-primary animate-spin"/>
          </div>
        }
      >
        <AddSprintAccessCheckAndRender projectId={params.id} />
      </Suspense>
    </>
  );
}
