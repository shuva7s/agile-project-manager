import PageIntro from "@/components/shared/PageIntro";
import { ListPlus } from "lucide-react";

export default function JoinProjectPage() {
  return (
    <main>
      <PageIntro
        icon={<ListPlus className="w-8 h-8"/>}
        heading="Join project"
        description="Join project created by others"
      />
    </main>
  );
}
