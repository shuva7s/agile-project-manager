export default function EachProjectPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <main>
      Each Project
      <p>Project id: {params.id}</p>
    </main>
  );
}
