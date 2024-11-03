"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { acceptOrRejectJoinRequest } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const AccOrRej = ({
  projectId,
  requestUserId,
}: {
  projectId: string;
  requestUserId: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  async function acceptRejectHandler(type: "accept" | "reject") {
    setProcessing(true);
    try {
      const { success, message } = await acceptOrRejectJoinRequest(
        projectId,
        type,
        requestUserId
      );
      setProcessing(false);
      if (!success) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
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
    <div className="flex flex-row gap-2">
      <Button
        disabled={processing}
        onClick={() => acceptRejectHandler("reject")}
        variant="ghost"
      >
        {processing ? <Loader className="animate-spin" /> : <span>Reject</span>}
      </Button>
      <Button
        onClick={() => acceptRejectHandler("accept")}
        disabled={processing}
      >
        {processing ? <Loader className="animate-spin" /> : <span>Accept</span>}
      </Button>
    </div>
  );
};

export default AccOrRej;
