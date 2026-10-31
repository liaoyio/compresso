import { HStack, VStack } from "@/components/stacks";

import { SavingsCalculatorOutput } from "./calculator";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatWithCommas } from "./format-with-commas";

export const Breakdown = ({
  savingsCalculatorOutput,
  monthlyVisitors,
  onChangedMonthlyVisitors,
}: {
  monthlyVisitors: number;
  onChangedMonthlyVisitors: (visitors: number) => void;
  savingsCalculatorOutput: SavingsCalculatorOutput;
}) => {
  return (
    <ScrollArea>
      <HStack className="gap-5 mt-5">
        {/* <h1>Breakdown</h1> */}
        <p>
          Using Vercel's bandwidth pricing as of Sep 2024 with the data for an
          average Compresso user, assuming all compressions are made for hosting
          on the web via Vercel.
        </p>
        <p>
          It's a rough estimate to give you an idea of the potential savings.
        </p>
        <div>
          <div className="flex justify-between">
            <div className="text-sm">Monthly visitors</div>
            <span className="text-sm">{formatWithCommas(monthlyVisitors)}</span>
          </div>
          <Slider
            className="mt-2"
            min={100}
            max={20000}
            step={100}
            value={[monthlyVisitors]}
            onValueChange={(value) => onChangedMonthlyVisitors(value[0])}
          />
        </div>
        {savingsCalculatorOutput.breakdown.map((item) => (
          <VStack className=" justify-between" key={item.title}>
            <div className="grow">
              <div className="text-md font-bold">{item.title}</div>
              <p className="text-sm text-gray-500">{item.calculation}</p>
            </div>
            <div className="whitespace-nowrap">
              {item.amount} {item.unit}
            </div>
          </VStack>
        ))}
      </HStack>
    </ScrollArea>
  );
};
