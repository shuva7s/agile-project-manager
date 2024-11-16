"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { startSprint } from "@/lib/actions/sprint.actions";

const StartSprint = ({ projectId }: { projectId: string }) => {
  console.log(projectId);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  async function handleClick(projectId: string) {
    try {
      setProcessing(true);
      const { success, message } = await startSprint(projectId);
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
    <Button disabled={processing} onClick={() => handleClick(projectId)}>
      {processing ? "Starting..." : "Start sprint"}
    </Button>
  );
};

export default StartSprint;
