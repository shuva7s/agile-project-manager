const getColorFromWeightage = (weightage: number) => {
  const clampedWeightage = Math.min(10, Math.max(1, weightage));
  const greenToRedColors = [
    "#00ff00",
    "#33ff00",
    "#66ff00",
    "#99ff00",
    "#ccff00",
    "#ffff00",
    "#ffcc00",
    "#ff9900",
    "#ff6600",
    "#ff0000",
  ];

  return greenToRedColors[clampedWeightage - 1];
};
const Weitage = ({ weightage }: { weightage: number }) => {
  const dotColor = getColorFromWeightage(weightage);
  return (
    <div
      style={{
        width: "1rem",
        height: "1rem",
        borderRadius: "50%",
        backgroundColor: dotColor,
        display: "inline-block",
      }}
    />
  );
};

export default Weitage;
