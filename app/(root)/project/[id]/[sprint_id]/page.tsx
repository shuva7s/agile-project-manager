import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function ProjectSprintPage({
  params,
}: {
  params: {
    id: string;
    sprint_id: string;
  };
}) {
  //First check user access again to determine if the user is admin or member and return the sprint tab
  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:px-4 xl:px-6"
      >
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
        <AccordionItem value="item-5">
          <AccordionTrigger className="">
            <h2 className="">Done</h2>
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
    </>
  );
}
