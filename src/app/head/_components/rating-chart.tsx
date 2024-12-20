"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Restaurant {
  scoreOverview: {
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
  };
}

interface RatingChartProps {
  data: Restaurant[];
}

export function RatingChart({ data }: RatingChartProps) {
  const chartData = data.reduce(
    (acc, restaurant) => {
      const { scoreOverview } = restaurant;
      return [
        {
          name: "5 Stars",
          value: acc[0].value + scoreOverview.fiveStars,
          fill: "#47b847",
        },
        {
          name: "4 Stars",
          value: acc[1].value + scoreOverview.fourStars,
          fill: "#99cc33",
        },
        {
          name: "3 Stars",
          value: acc[2].value + scoreOverview.threeStars,
          fill: "#ffcc00",
        },
        {
          name: "2 Stars",
          value: acc[3].value + scoreOverview.twoStars,
          fill: "#ff9933",
        },
        {
          name: "1 Star",
          value: acc[4].value + scoreOverview.oneStar,
          fill: "#ff4d4d",
        },
      ];
    },
    [
      { name: "5 Stars", value: 0 },
      { name: "4 Stars", value: 0 },
      { name: "3 Stars", value: 0 },
      { name: "2 Stars", value: 0 },
      { name: "1 Star", value: 0 },
    ],
  );

  const chartConfig = {
    rating: {
      label: "Rating",
    },
    "5 Stars": {
      label: "5 Star",
      color: "#47b847",
    },
    "4 Stars": {
      label: "4 Star",
      color: "#99cc33",
    },
    "3 Stars": {
      label: "3 Star",
      color: "#ffcc00",
    },
    "2 Stars": {
      label: "2 Star",
      color: "#ff9933",
    },
    "1 Star": {
      label: "1 Star",
      color: "#ff4d4d",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Overview</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-96 w-full" config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
