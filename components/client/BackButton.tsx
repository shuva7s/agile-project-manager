"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="fixed right-4 bottom-4 bg-background p-2.5 lg:p-3 rounded-2xl"
    >
      <Undo2 className="text-primary w-6 h-6" />
    </div>
  );
};

export default BackButton;
