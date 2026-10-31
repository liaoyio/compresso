import { createSupabaseClient } from "@/lib/auth/create-supabase-client";
import { useQuery } from "@tanstack/react-query";
import { formatWithCommas } from "./format-with-commas";

export interface SavingsCalculatorInput {
  bytesSavedPerMonth: number;
  visitorsPerMonth: number;
  numberOfMonths: number; // Added this line
}

export interface SavingsCalculatorOutput {
  totalSavings: string;
  breakdown: CalculationLineItem[];
}

export const useSavingsCaluclator = (answer: string) => {
  const { data: savings, isLoading } = useQuery({
    queryKey: ["savings", answer],
    queryFn: () => lookupSavings(answer),
  });

  return { savings, isLoading };
};

export type Savings = Awaited<ReturnType<typeof lookupSavings>>;

const lookupSavings = async (answer: string) => {
  const supabase = createSupabaseClient();

  // translate between the current survey answers in the db and the new ones here
  let map = {
    "Content for website": "Content for website",
    Archiving: "Archiving",
    Messaging: "Discord",
  };

  const lookupString = map[answer as keyof typeof map];

  const { error, data } = await supabase
    .from("survey_byte_savings")
    .select("*")
    .eq("answer", lookupString);

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    throw new Error("No data found for answer");
  }

  const datapoint = data[0];
  const dailyBytesSaved = parseFloat(datapoint.avg_daily_bytes_saved);
  const dailyCompressions = parseFloat(datapoint.avg_daily_compressions);

  const monthlyBytesSaved = dailyBytesSaved * 30;
  const yearlyBytesSaved = dailyBytesSaved * 365;

  const monthlyCompressions = dailyCompressions * 30;
  const yearlyCompressions = dailyCompressions * 365;

  return {
    bytes: {
      daily: dailyBytesSaved,
      monthly: monthlyBytesSaved,
      yearly: yearlyBytesSaved,
    },
    count: {
      daily: dailyCompressions,
      monthly: monthlyCompressions,
      yearly: yearlyCompressions,
    },
  };
};

export interface CalculationLineItem {
  title: string;
  unit: string; // e.g. dolllars, days, GB, etc
  amount: number | string;
  calculation: string; // e.g. (1000 GB * 0.15 USD)
}

export function calculateHostingSavings({
  bytesSavedPerMonth,
  visitorsPerMonth,
  numberOfMonths,
}: SavingsCalculatorInput): SavingsCalculatorOutput {
  const totalBytesPerMonth = bytesSavedPerMonth * visitorsPerMonth;
  const totalGBPerMonth = totalBytesPerMonth / (1024 * 1024 * 1024);
  const freeGBPerMonth = 1024; // 1 TB per month
  const paidGBPerMonth = Math.max(0, totalGBPerMonth - freeGBPerMonth);
  const monthlyCost = paidGBPerMonth * 0.15; // $0.15 per GB after the free tier
  const totalCost = monthlyCost * numberOfMonths;

  const breakdown: CalculationLineItem[] = [
    {
      title: "Monthly data savings",
      unit: "GB",
      amount: formatWithCommas(totalGBPerMonth),
      calculation: `${formatWithCommas(
        totalBytesPerMonth
      )} bytes / (1024 * 1024 * 1024)`,
    },
    {
      title: "Total data savings",
      unit: "GB",
      amount: formatWithCommas(totalGBPerMonth * numberOfMonths),
      calculation: `${formatWithCommas(
        totalGBPerMonth
      )} GB * ${numberOfMonths}`,
    },
    {
      title: "Free data allowance per month",
      unit: "GB",
      amount: formatWithCommas(freeGBPerMonth),
      calculation: `1024 GB`,
    },
    {
      title: "Chargeable data saved per month",
      unit: "GB",
      amount: formatWithCommas(paidGBPerMonth),
      calculation: `${totalGBPerMonth} - ${freeGBPerMonth}`,
    },
    {
      title: "Savings per GB over free allowance",
      unit: "USD",
      amount: "0.15",
      calculation: "0.15 USD per GB",
    },
    {
      title: `Total savings over ${numberOfMonths} months`,
      unit: "USD",
      amount: formatWithCommas(totalCost),
      calculation: `${monthlyCost} * ${numberOfMonths}`,
    },
  ];

  return {
    totalSavings: `${formatWithCommas(totalCost)}`,
    breakdown,
  };
}
