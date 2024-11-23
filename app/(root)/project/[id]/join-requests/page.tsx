import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkUserIsAdminAndReturnJoinRequests } from "@/lib/actions/project.actions";
import { Suspense } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import JoinReqsLoader from "@/components/loaders/JoinReqsLoader";
import AccOrRej from "@/components/client/AccOrRej";

async function JoinReqAccessCheckAndRender({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const { success, message, joinRequests } =
      await checkUserIsAdminAndReturnJoinRequests(projectId);
    if (success) {
      return (
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinRequests.length > 0 ? (
              joinRequests.map((joinRequest: any) => (
                <Card key={joinRequest.username}>
                  <CardHeader className="flex flex-row gap-4 items-center flex-wrap">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={joinRequest.photo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-primary font-semibold tracking-normal">
                        {joinRequest.firstName !== "" &&
                        joinRequest.lastName !== ""
                          ? `${joinRequest.firstName} ${joinRequest.lastName}`
                          : joinRequest.username}
                      </CardTitle>
                      <CardDescription className="tracking-normal mt-0.5">
                        {joinRequest.email}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-end">
                    <AccOrRej
                      projectId={projectId}
                      requestUserId={joinRequest._id}
                    />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No join requests</p>
            )}
          </div>
        </section>
      );
    } else {
      return <ErrorDiv text={message} />;
    }
  } catch (error: any) {
    return <ErrorDiv text={error.message} />;
  }
}

export default function JoinRequestsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  // return <section>Join Requests</section>;
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="text-xl my-8 ">
          <p className="text-primary font-semibold">Join requests</p>
        </div>
        <Suspense fallback={<JoinReqsLoader />}>
          <JoinReqAccessCheckAndRender projectId={params.id} />
        </Suspense>
      </div>
    </>
  );
}
