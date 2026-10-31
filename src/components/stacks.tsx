import { cn } from "@/lib/utils";

export const VStack = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col xs:flex-row gap-2", className)}>
      {children}
    </div>
  );
};

export const HStack = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};
