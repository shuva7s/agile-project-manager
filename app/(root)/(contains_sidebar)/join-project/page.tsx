import PageIntro from "@/components/shared/PageIntro";
import Image from "next/image";

export default function JoinProjectPage() {
  return (
    <main className="border-l page_border">
      <PageIntro
        heading="Join project"
        description="Join project created by others"
      />
      <hr />
      <section className="wrap flex flex-col md:flex-row justify-between items-center md:items-start min-h-[70vh] lg:px-16">
        <div className="mt-12 flex flex-row gap-4 items-center h-fit">
          <div className="w-80 h-12 rounded-2xl bg-accent flex-shrink-0" />
          <div className="w-16 h-12 rounded-2xl bg-primary flex-shrink-0" />
        </div>

        <div className="md:self-end">
          <Image
            className="flex-1 max-w-[300px] md:max-w-[450px] lg:max-w-[550px] opacity-80 dark:opacity-70 w-full object-cover pointer-events-none -rotate-3"
            src="/join.png"
            draggable={false}
            alt="join project"
            width={600}
            height={600}
            priority={true}
          />
        </div>
      </section>
    </main>
  );
}
