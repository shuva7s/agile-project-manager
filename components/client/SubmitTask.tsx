"use client";
import { Button } from "../ui/button";
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
import { submitTaskFunction } from "@/lib/actions/task.actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const SubmitTask = ({
  projectId,
  taskId,
  taskSubmitted,
}: {
  projectId: string;
  taskId: string;
  taskSubmitted: boolean;
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  async function hadleSubmit() {
    try {
      setProcessing(true);
      const { success, message } = await submitTaskFunction(projectId, taskId);

      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={processing || taskSubmitted}>
          {taskSubmitted ? "Under review" : "Submit"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {taskSubmitted ? "Task already submitted" : "Submit task?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {taskSubmitted
              ? "Task is under review"
              : "Are you sure you want to submit this task?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex mt-4 sm:mt-0">
          {taskSubmitted ? (
            <AlertDialogCancel>Close</AlertDialogCancel>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={hadleSubmit}>
                Continue
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmitTask;
