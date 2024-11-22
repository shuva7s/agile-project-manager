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
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const DeleteProject = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  async function handleDelete(projectId: string) {
    try {
      const { message, success } = await deleteProject(projectId);
      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });

      if (success) {
        router.replace("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            project and remove all related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(projectId)}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 /> Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProject;
