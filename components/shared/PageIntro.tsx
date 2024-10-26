const PageIntro = ({
  icon,
  heading,
  description,
}: {
  icon: React.ReactNode;
  heading: string;
  description: string;
}) => {
  return (
    <div>
      <div className="flex items-center">
        <div className="inline-flex text-primary mr-2 rounded-md">{icon}</div>
        <h1 className="page_heading">{heading}</h1>
      </div>
      <p className="page_des mt-2 text-lg">{description}</p>
    </div>
  );
};

export default PageIntro;
