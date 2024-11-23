import PageIntro from "@/components/shared/PageIntro";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { UserButton } from "@clerk/nextjs";

export default function UserSettingsPage() {
  return (
    <main className="min-h-[150vh] border-l page_border">
      <PageIntro heading="Settings" description="Customize your settings" />
      <hr />
      <section className="wrap">
        <div className="flex w-full justify-between mt-4 max-w-lg items-center py-2">
          Theme
          <ModeToggle />
        </div>
        <div className="flex w-full justify-between mt-4 max-w-lg items-center py-2">
          Profile
          <UserButton />
        </div>
      </section>
    </main>
  );
}
