import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkUserIsAdminAndReturnMembers } from "@/lib/actions/project.actions";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RemoveMember from "@/components/client/RemoveMember";
import JoinReqsLoader from "@/components/loaders/JoinReqsLoader";

async function MembersRenderer({ projectId }: { projectId: string }) {
  try {
    const { success, message, members, isAdmin } =
      await checkUserIsAdminAndReturnMembers(projectId);

    console.dir(members);

    if (success) {
      return (
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.length > 0 ? (
              members.map((member: any) => (
                <Card key={member.username}>
                  <CardHeader className="flex flex-row gap-4 items-center flex-wrap">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.photo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-primary font-semibold tracking-normal">
                        {member.firstName !== "" && member.lastName !== ""
                          ? `${member.firstName} ${member.lastName}`
                          : member.username}
                      </CardTitle>
                      <CardDescription className="tracking-normal mt-0.5">
                        {member.email}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-end">
                    {isAdmin ? (
                      <RemoveMember
                        projectId={projectId}
                        memberIdToRemove={member._id}
                        memberUsername={member.username}
                        memberRole={member.role}
                      />
                    ) : (
                      <Badge
                        className={`px-2 py-1.5 ${
                          member.role === "admin"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                        variant={
                          member.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {member.role === "admin" ? "Admin" : "Member"}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No members to show</p>
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

export default function ProjectMembersPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="text-xl my-8 ">
          <p className="text-primary font-semibold">Members</p>
        </div>
        <Suspense fallback={<JoinReqsLoader />}>
          <MembersRenderer projectId={params.id} />
        </Suspense>
      </div>
    </>
  );
}
