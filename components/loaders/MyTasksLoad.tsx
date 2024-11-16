import { Skeleton } from "../ui/skeleton";

const MyTasksLoad = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 wrap">
      <Skeleton className="w-full h-[13.5rem] rounded-2xl" />
      <Skeleton className="w-full h-[13.5rem] rounded-2xl" />
      <Skeleton className="w-full h-[13.5rem] rounded-2xl" />
      <Skeleton className="w-full h-[13.5rem] rounded-2xl" />
      <Skeleton className="w-full h-[13.5rem] rounded-2xl" />
    </section>
  );
};

export default MyTasksLoad;
