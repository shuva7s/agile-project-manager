const PageIntro = ({
  heading,
  description,
  nowrap = false,
}: {
  heading: string;
  description: string;
  nowrap?: boolean;
}) => {
  return (
    <div className={`${!nowrap && "wrap mt-4"} mt-4`}>
      <h1 className="text-3xl font-bold tracking-wide">{heading}</h1>
      <p className="text-muted-foreground mt-2 text-lg">{description}</p>
    </div>
  );
};

export default PageIntro;
