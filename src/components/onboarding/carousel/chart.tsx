"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import byteSize from "byte-size";
import { AnimatePresence, motion } from "framer-motion";
import { delay } from "./examples";

export default function SizeChart({
  original = 533563344,
  compressed = 31417776,
  type = "Screen recording",
}: {
  original: number;
  compressed: number;
  type: string;
}) {
  const originalSize = byteSize(original);
  const compressedSize = byteSize(compressed);
  return (
    <AnimatePresence>
      <Card className="bg-transparent border-none w-full">
        <CardContent className="flex gap-4 p-4">
          <div className="grid items-center gap-2">
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-sm text-muted-foreground">Original</div>
              <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                {originalSize.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {originalSize.unit}
                </span>
              </div>
            </div>
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-sm text-muted-foreground">Compressed</div>
              <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                {compressedSize.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {compressedSize.unit}
                </span>
              </div>
            </div>
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="flex flex-col items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {type}
                </motion.div>

                <motion.div
                  className="text-sm w-full h-2 bg-foreground/10 font-normal text-muted-foreground"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: delay / 1000 }}
                ></motion.div>
                {/* 8/12
              <span className="text-sm font-normal text-muted-foreground">
                hr
              </span> */}
              </div>
            </div>
          </div>
          <ChartContainer
            config={{
              move: {
                label: "Original",
                color: "hsl(var(--chart-1))",
              },
              exercise: {
                label: "Compressed",
                color: "hsl(var(--chart-2))",
              },
              stand: {
                label: "Percent smaller",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="mx-auto aspect-square w-full max-w-[80%]"
          >
            <RadialBarChart
              margin={{
                left: -10,
                right: -10,
                top: -10,
                bottom: -10,
              }}
              data={[
                {
                  activity: "compressed",
                  value: (compressed / original) * 100,
                  fill: "var(--color-exercise)",
                },
                {
                  activity: "original",
                  value: (original / original) * 100,
                  fill: "var(--color-stand)",
                },
                //   {
                //     activity: "percent smaller",
                //     value: 100 - (compressed / original) * 100,
                //     fill: "var(--color-move)",
                //   },
              ]}
              innerRadius="40%"
              barSize={54}
              startAngle={450}
              endAngle={90}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                dataKey="value"
                tick={false}
              />
              <RadialBar dataKey="value" background cornerRadius={5} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </AnimatePresence>
  );
}
