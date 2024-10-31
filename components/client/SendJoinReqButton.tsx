"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { addJoinRequest } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";

const SendJoinReqButton = ({ projectId }: { projectId: string }) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  async function hadleClick() {
    setProcessing(true);

    try {
      const { success, message } = await addJoinRequest(projectId);
      if (success) {
        toast({ title: "Success", description: message });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setProcessing(false);
  }
  return (
    <Button onClick={hadleClick} disabled={processing} className="rounded-2xl">
      {processing ? (
        <>
          <Loader className="mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <span>Send join request</span>
      )}
    </Button>
  );
};

export default SendJoinReqButton;
