import { cn } from "@/lib/utils";

export const BackButton = ({
  onGoBack,
  className,
}: {
  onGoBack: () => void;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "text-sm opacity-50 hover:opacity-100 px-3 py-2 hover:bg-foreground/5 rounded-md",
        className
      )}
      onClick={onGoBack}
    >
      {" "}
      ← Back
    </button>
  );
};
