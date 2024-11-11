"use client";
import { Button } from "../ui/button";
import { SquareCheckBig } from "lucide-react";
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
import { TextSearch } from "lucide-react";
const SubmitTask = ({
  projectId,
  taskId,
  taskSubmitted,
}: {
  projectId: string;
  taskId: string;
  taskSubmitted: boolean;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={taskSubmitted}
          variant="secondary"
          size="icon"
          className="p-0"
        >
          {taskSubmitted ? <TextSearch /> : <SquareCheckBig />}
          {/* <SquareCheckBig className="h-10 w-10" /> */}
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
              <AlertDialogAction>Continue</AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmitTask;
