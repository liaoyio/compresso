import { useTitleBar } from "@/lib/store/store-hooks";
import { cn } from "@/lib/utils";
import { MotionProps } from "framer-motion";

export const TitleBarRoot = ({ children }: { children: React.ReactNode }) => {
  const { isHoveringTitleBar, setIsHoveringTitleBar } = useTitleBar();

  return (
    <div
      data-tauri-drag-region
      onMouseEnter={() => setIsHoveringTitleBar(true)}
      onMouseLeave={() => setIsHoveringTitleBar(false)}
      className={cn(
        "h-[52px] p-3 flex items-center justify-end w-full transition-all delay-100 duration-500",
        isHoveringTitleBar &&
          "bg-foreground/1  shadow-[0_2px_4px_-0px_rgba(0,0,0,0.05)]"
      )}
    >
      {children}
    </div>
  );
};

export const TitleBarButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps) => {
  return (
    <button
      initial={{ opacity: 0.5, scale: 0.0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0.5, scale: 0.0 }}
      transition={{ duration: 0.3 }}
      {...props}
      className={cn(
        "h-[28px] w-[45px] disabled:opacity-50",
        "flex items-center active:bg-foreground/10",
        "disabled:opacity-50",
        "hover:bg-foreground/5 disabled:hover:bg-transparent",
        "rounded-lg justify-center p-[8px]",
        className
      )}
    >
      {children}
    </button>
  );
};
