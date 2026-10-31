import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const SurveyButton = ({
  onClick,
  className,
  children,
  isSelected,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}) => {
  return (
    <Button
      onClick={() => {
        onClick();
      }}
      className={cn(
        "px-5 py-7 text-lg border-[1px] rounded-xl  active:bg-foreground/20",
        className,
        isSelected ? "bg-foreground/10 border-selection" : "bg-foreground/5"
      )}
      variant="secondary"
    >
      {children}
    </Button>
  );
};
