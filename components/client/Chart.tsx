// "use client";

// import {
//   Label,
//   PolarGrid,
//   PolarRadiusAxis,
//   RadialBar,
//   RadialBarChart,
// } from "recharts";
// import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// interface ChartProps {
//   total: number;
//   completed: number;
// }

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig;

// export function Chart({ total, completed }: ChartProps) {
//   const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
//   const chartData = [
//     { browser: "safari", visitors: completionPercentage, fill: "var(--color-safari)" },
//   ];

//   return (
//     <ChartContainer
//       config={chartConfig}
//       className="mx-auto aspect-square max-h-[250px]"
//     >
//       <RadialBarChart
//         data={chartData}
//         startAngle={0}
//         endAngle={90}
//         innerRadius={80}
//         outerRadius={120}
//       >
//         <PolarGrid
//           gridType="circle"
//           radialLines={false}
//           stroke="none"
//           className="first:fill-muted last:fill-background"
//           polarRadius={[86, 74]}
//         />
//         <RadialBar dataKey="visitors" background cornerRadius={10} />
//         <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//           <Label
//             content={({ viewBox }) => {
//               if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                 return (
//                   <text
//                     x={viewBox.cx}
//                     y={viewBox.cy}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                   >
//                     <tspan
//                       x={viewBox.cx}
//                       y={viewBox.cy}
//                       className="fill-foreground text-4xl font-bold"
//                     >
//                       {completionPercentage.toFixed(0)}%
//                     </tspan>
//                     <tspan
//                       x={viewBox.cx}
//                       y={(viewBox.cy || 0) + 24}
//                       className="fill-muted-foreground"
//                     >
//                       {completed.toLocaleString()} / {total.toLocaleString()}
//                     </tspan>
//                   </text>
//                 );
//               }
//               return null;
//             }}
//           />
//         </PolarRadiusAxis>
//       </RadialBarChart>
//     </ChartContainer>
//   );
// }

"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ChartProps {
  total: number;
  completed: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart({ total, completed }: ChartProps) {
  const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
  const angle = completionPercentage * 3.6;
  const chartData = [
    {
      browser: "safari",
      visitors: completionPercentage,
      fill: "var(--color-safari)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px] pointer-events-none bg-transparent"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + angle}
        innerRadius={80}
        outerRadius={120}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-accent last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="visitors" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {completionPercentage.toFixed(0)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {completed.toLocaleString()} / {total.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
