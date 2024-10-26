import PageIntro from "@/components/shared/PageIntro";
import { ListTodo } from "lucide-react";

export default function YourTasksPage() {
  return (
    <main>
      <PageIntro
        icon={<ListTodo className="w-8 h-8"/>}
        heading="Your tasks"
        description="Tasks you are assigned will appear here"
      />
    </main>
  );
}
