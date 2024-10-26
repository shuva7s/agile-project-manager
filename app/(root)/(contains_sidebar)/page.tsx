import PageIntro from "@/components/shared/PageIntro";
import { Grid2x2Check } from "lucide-react";

export default function Homepage() {
  return (
    <main className="min-h-[150vh]">
      <PageIntro
        icon={<Grid2x2Check className="w-8 h-8"/>}
        heading="Your projects"
        description="Projects created by you"
      />
    </main>
  );
}
