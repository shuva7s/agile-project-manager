"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { removeMemberFromProject } from "@/lib/actions/project.actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const RemoveMember = ({
  projectId,
  memberUsername,
  memberIdToRemove,
  memberRole,
}: {
  projectId: string;
  memberUsername: string;
  memberIdToRemove: string;
  memberRole: "member" | "admin";
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  async function removeHandler(projectId: string, memberIdToRemove: string) {
    try {
      setProcessing(true);
      const { success, message } = await removeMemberFromProject(
        projectId,
        memberIdToRemove
      );
      setProcessing(false);

      toast({
        title: "Success",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={memberRole === "admin" ? "default" : "outline"}
          disabled={memberRole === "admin" || processing}
        >
          {memberRole === "admin" ? "Admin" : "Remove"}
          {processing && "ing..."}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove{" "}
            <span className="text-foreground font-bold">{memberUsername}</span>{" "}
            from the project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeHandler(projectId, memberIdToRemove)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMember;
