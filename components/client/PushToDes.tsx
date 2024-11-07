"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { moveTaskToDesigning } from "@/lib/actions/task.actions";
import { useToast } from "@/hooks/use-toast";
const PushToDes = ({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  async function handleMoveToDes() {
    setProcessing(true);
    try {
      const { success, message } = await moveTaskToDesigning(projectId, taskId);
      setProcessing(false);

      toast({
        title: "Success",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      setProcessing(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleMoveToDes}
            disabled={processing}
            size="icon"
            variant="outline"
          >
            {processing ? <Loader className="animate-spin" /> : <ArrowRight />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Push to designing</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PushToDes;
