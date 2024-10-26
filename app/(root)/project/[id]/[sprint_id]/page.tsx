export default function ProjectSprintPage({
  params,
}: {
  params: {
    id: string;
    sprint_id: string;
  };
}) {
  return (
    <main>
      Project Sprint
      <p>Project id: {params.id}</p>
      <p>Sprint id: {params.sprint_id}</p>
    </main>
  );
}
