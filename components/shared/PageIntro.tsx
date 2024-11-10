const PageIntro = ({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) => {
  return (
    <div className="mt-4">
      <h1 className="text-3xl font-bold tracking-wide">{heading}</h1>
      <p className="text-muted-foreground mt-2 text-lg">{description}</p>
    </div>
  );
};

export default PageIntro;
