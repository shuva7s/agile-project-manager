import PageIntro from "@/components/shared/PageIntro";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Settings } from "lucide-react";

export default function UserSettingsPage() {
  return (
    <main>
      <PageIntro
        icon={<Settings className="w-8 h-8"/>}
        heading="Settings"
        description="Customize your settings"
      />
      <div className="flex w-full justify-between mt-4 max-w-lg items-center py-2 border-b">
        Theme
        <ModeToggle />
      </div>
    </main>
  );
}
