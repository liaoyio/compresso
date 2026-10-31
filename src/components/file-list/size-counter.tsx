import { cn } from "@/lib/utils";
import byteSize from "byte-size";

export const SizeCounter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex flex-col gap-1 w-32 rounded-md 
  
  bg-foreground/[1%] p-2"
    >
      {children}
    </div>
  );
};

export const SizeCounterLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="text-[0.7rem] text-foreground/50">{children}</div>
  );
};

export const SizeCounterValue = ({
  value,
  className,
}: // slotKey,
{
  value: number;
  slotKey: string;
  className?: string;
}) => {
  const human = byteSize(value * 1e6, { locale: "en-US", precision: 0 }).value;
  const unit = byteSize(value * 1e6, { locale: "en-US", precision: 0 }).unit;

  return (
    <div className={cn(" whitespace-nowrap", className)}>
      {human}<span className="ml-[1px] opacity-80">{unit}</span>
    </div>
  );
};

export const FileName = ({ name }: { name: string }) => {
  // a file can be name.01.mp4 or name.034.03.mp4 or name.mp4

  const parts = name.split(".");
  parts.pop() || "";
  const nameWithoutExtension = parts.join(".");

  return (
    <div className="font-bold opacity-90 flex">
      {nameWithoutExtension}
      {/* <div className="font-normal opacity-70">.{extension}</div> */}
    </div>
  );
};
