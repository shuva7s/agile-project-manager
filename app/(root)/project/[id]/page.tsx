import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
export default function EachProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  //First check user access again to determine if the user is admin or member and return the first tab here
  return (
    <>
      <section className="max-w-5xl mx-auto my-8 flex flex-row p-2.5 rounded-[1.25rem] bg-accent dark:bg-accent/50 overflow-x-auto scrollbar-hidden">
        <Button>Sprint 13</Button>
        <Button variant="ghost">Sprint 12</Button>
        <Button variant="ghost">Sprint 11</Button>
        <Button variant="ghost">Sprint 10</Button>
        <Button variant="ghost">Sprint 9</Button>
        <Button variant="ghost">Sprint 8</Button>
        <Button variant="ghost">Sprint 7</Button>
        <Button variant="ghost">Sprint 6</Button>
        <Button variant="ghost">Sprint 5</Button>
        <Button variant="ghost">Sprint 4</Button>
        <Button variant="ghost">Sprint 3</Button>
        <Button variant="ghost">Sprint 2</Button>
        <Button variant="ghost">Sprint 1</Button>
      </section>
      <Accordion
        type="multiple"
        defaultValue={["item-0", "item-1", "item-2", "item-3", "item-4"]}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:px-4 xl:px-6"
      >
        <AccordionItem value="item-0">
          <AccordionTrigger className="">
            <h2 className="">Requirements</h2>
          </AccordionTrigger>
          <AccordionContent className="min-h-screen flex flex-col gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1">
          <AccordionTrigger className="">
            <h2 className="">Designing</h2>
          </AccordionTrigger>
          <AccordionContent className="min-h-screen flex flex-col gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="">
            <h2 className="">Development</h2>
          </AccordionTrigger>
          <AccordionContent className="min-h-screen flex flex-col gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="">
            <h2 className="">Testing</h2>
          </AccordionTrigger>
          <AccordionContent className="min-h-screen flex flex-col gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="">
            <h2 className="">Deployment</h2>
          </AccordionTrigger>
          <AccordionContent className="min-h-screen flex flex-col gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="md:mx-16 my-4 mb-1">
        <AccordionItem value="item-5">
          <AccordionTrigger className="">
            <h2 className="">Done</h2>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
            <div className="bg-background dark:bg-accent w-full h-36 rounded-2xl"></div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
