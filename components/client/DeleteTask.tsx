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
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteTask } from "@/lib/actions/task.actions";
const DeleteTask = ({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) => {
  const { toast } = useToast();
  async function handleDelete(projectId: string, taskId: string) {
    try {
      const { message, success } = await deleteTask(projectId, taskId);
      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
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
        <Button variant="outline" size="icon">
          <Trash />
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
            onClick={() => handleDelete(projectId, taskId)}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash /> Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTask;
