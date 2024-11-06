import { Skeleton } from "../ui/skeleton";

const BacklogLoader = () => {
  return (
    <section>
      <div className="flex justify-end max-w-5xl mx-auto rounded-2xl">
        <Skeleton className="h-12 sm:h-10 w-full sm:w-32 rounded-2xl bg-primary/50" />
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="w-full h-40 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
      </div>
    </section>
  );
};

export default BacklogLoader;
