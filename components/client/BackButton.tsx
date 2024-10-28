"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="fixed right-4 bottom-4 rounded-md bg-accent p-2"
    >
      <Undo2 className="text-primary w-6 h-6" />
    </div>
  );
};

export default BackButton;
