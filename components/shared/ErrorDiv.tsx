const ErrorDiv = ({ text }: { text: string }) => {
  return (
    <div className="p-6 bg-destructive/50 border border-destructive rounded-2xl text-red-500">
      {text}
    </div>
  );
};

export default ErrorDiv;
