import { Skeleton } from "../ui/skeleton";

const ProjectPageLoader = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between">
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 bg-primary/30 rounded-2xl" />
            <Skeleton className="w-52 h-8 bg-primary/30 rounded-2xl" />
          </div>
          <Skeleton className="w-36 h-6 bg-primary/30 rounded-2xl mt-2" />
        </div>
        <Skeleton className="w-full sm:w-24 h-12 sm:h-10 bg-primary/30 rounded-2xl mt-5 sm:mt-4" />
      </section>
    </>
  );
};

export default ProjectPageLoader;
