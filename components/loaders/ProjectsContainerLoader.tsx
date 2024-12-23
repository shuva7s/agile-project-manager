import { Skeleton } from "../ui/skeleton";

const ProjectsContainerLoader = ({ count = 7 }: { count?: number }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 wrap">
      {[...Array(count)].map((_, i) => (
        <div key={`${i}aaa`} className="w-full p-4 rounded-2xl border">
          <div className="flex flex-col gap-3">
            <Skeleton className="w-40 h-8 bg-primary/30" />
            <Skeleton className="w-52 h-6 bg-primary/30" />
          </div>
          <div className="min-h-48 flex justify-center items-center text-muted-foreground">
            <Skeleton className="min-h-[10.5rem] aspect-square rounded-full bg-accent my-12 flex justify-center items-center">
              <div className="min-h-36 aspect-square rounded-full bg-background"/>
            </Skeleton>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <div className="flex gap-2">
              <Skeleton className="w-6 h-6 bg-primary/30" />
              <Skeleton className="w-12 h-6 bg-border dark:bg-accent" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-6 h-6 bg-primary/30" />
              <Skeleton className="w-16 h-6 bg-border dark:bg-accent" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProjectsContainerLoader;
