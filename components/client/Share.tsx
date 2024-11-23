"use client";

import { Button } from "../ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook

const Share = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();

  const handleShare = () => {
    const url = `https://agile-project-manager.vercel.app/project/${projectId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Project URL has been copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy the URL. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-2 transition-all rounded-md hover:px-4 hover:text-primary py-6"
      onClick={handleShare}
    >
      <Share2 /> Share
    </Button>
  );
};

export default Share;

