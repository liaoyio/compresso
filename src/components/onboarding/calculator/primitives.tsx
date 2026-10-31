import { cn } from "@/lib/utils";

const TimePeriod = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("text-sm opacity-50 font-normal inline", className)}>
      {children}
    </div>
  );
};

const Datapoint = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border p-3 px-4 rounded-xl bg-foreground/5",
        className
      )}
    >
      {children}
    </div>
  );
};
const DatapointLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("text-sm opacity-50", className)}>{children}</div>;
};
const DatapointValue = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("text-lg font-bold", className)}>{children}</div>;
};

const ContentContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "p-5 mt-6 flex flex-col gap-5 justify-start items-start max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

const Heading = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-2xl font-bold max-w-sm">{children}</h1>;
};

export {
  TimePeriod,
  Datapoint,
  DatapointLabel,
  DatapointValue,
  ContentContainer,
  Heading,
};
