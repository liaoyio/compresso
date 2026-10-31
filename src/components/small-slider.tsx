import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const SmallSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-foreground/10">
      <SliderPrimitive.Range className="absolute h-full bg-selection" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] dark:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
SmallSlider.displayName = SliderPrimitive.Root.displayName;

export const SmallSliderRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full touch-none select-none items-center">{children}</div>
  );
};

export const SmallSliderLabels = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between opacity-50 text-xs my-3">
      {children}
    </div>
  );
};

export const SmallSliderLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="text-xs">{children}</div>;
};
