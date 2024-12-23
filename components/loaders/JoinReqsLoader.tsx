import { Skeleton } from "../ui/skeleton";

const JoinReqsLoader = () => {
  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="w-full h-44 bg-primary/30 rounded-2xl" />
      <Skeleton className="w-full h-44 bg-primary/30 rounded-2xl" />
      <Skeleton className="w-full h-44 bg-primary/30 rounded-2xl" />
    </section>
  );
};

export default JoinReqsLoader;
