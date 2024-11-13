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
      <section className="wrap flex flex-col md:flex-row justify-between min-h-[70vh] lg:px-16">
        <div className="mt-12 flex flex-row gap-4 items-center h-fit">
          <div className="w-80 h-12 rounded-2xl bg-accent flex-shrink-0" />
          <div className="w-16 h-12 rounded-2xl bg-primary flex-shrink-0" />
        </div>

        <div className="self-end">
          <Image
            className="lg:self-end flex-1 max-w-[550px] w-full object-cover pointer-events-none"
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
