"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { addSprintToProject } from "@/lib/actions/sprint.actions";
import { useToast } from "@/hooks/use-toast";

const AddSprint = ({ projectId }: { projectId: string }) => {
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();

  async function handleClick(projectId: string) {
    try {
      setProcessing(true);
      const { success, message } = await addSprintToProject(projectId);

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
    <Button onClick={() => handleClick(projectId)} disabled={processing}>
      Add sprint
    </Button>
  );
};

export default AddSprint;
