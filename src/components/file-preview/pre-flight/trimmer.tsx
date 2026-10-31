import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";
import { forwardRef, useRef, useState } from "react";

export type TrimmerUpdate = {
  startSecs: number;
  endSecs: number;
  trimmedDuration: number;
};

export const Trimmer = ({
  duration,
  onValueChange,
  onSeek,
  currentTime,
  defaultStart,
  defaultEnd,
}: {
  duration: number;
  onValueChange: (update: TrimmerUpdate) => void;
  onSeek: (percentage: number) => void;
  currentTime: number;
  defaultStart?: number;
  defaultEnd?: number;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const previousRange = useRef<[number, number]>([0, 1]);
  const [isAdjusting, setIsAdjusting] = useState(false);

  // caluclate the slider range
  const range = [
    (defaultStart ?? 0) / duration,
    (defaultEnd ?? duration) / duration,
  ];

  // the user is adjusting the trimmer
  const handleValueChange = (value: number[]) => {
    const nextUpdate: TrimmerUpdate = {
      startSecs: duration * value[0],
      endSecs: duration * value[1],
      trimmedDuration: duration * (value[1] - value[0]),
    };
    onValueChange(nextUpdate);

    // figure out which thumb is being moved, then send the seek event for that thumb
    // so we get a real time video preview of the trim edge
    const isLeftThumb = value[0] !== previousRange.current[0];
    const isRightThumb = value[1] !== previousRange.current[1];
    if (isLeftThumb) {
      onSeek(value[0]);
    } else if (isRightThumb) {
      onSeek(value[1]);
    }
    previousRange.current = value as [number, number];
  };

  // the current time in the video as a red line on top of the slider
  const playheadPercentage = currentTime / duration;

  return (
    <div className="w-full">
      <Slider.Root
        className="relative flex h-10 w-full touch-none select-none items-center bg-foreground/10 rounded"
        defaultValue={[0, 1]}
        value={range}
        onValueChange={handleValueChange}
        minStepsBetweenThumbs={0.001}
        max={1}
        min={0}
        step={0.0001}
        onPointerDown={() => setIsAdjusting(true)}
        onPointerUp={() => setIsAdjusting(false)}
      >
        <Track ref={trackRef}>
          <Range />
        </Track>
        <Thumb value={range[0]} totalDuration={duration} />
        <Thumb value={range[1]} totalDuration={duration} />

        {!isAdjusting && (
          <div
            className="absolute left-0 top-0 h-full w-[2px] bg-red-500 pointer-events-none"
            style={{ left: `${playheadPercentage * 100}%` }}
          />
        )}
      </Slider.Root>
    </div>
  );
};
const Range = ({ className }: { className?: string }) => {
  return (
    <Slider.Range
      className={cn("absolute h-full bg-yellow-500 rounded", className)}
    />
  );
};

const Track = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children }, ref) => {
  return (
    <Slider.Track
      ref={ref}
      className={cn("relative h-full grow rounded", className)}
    >
      {children}
    </Slider.Track>
  );
});
Track.displayName = "Track";

const Thumb = ({
  className,
  value,
  totalDuration,
}: {
  className?: string;
  value: number;
  totalDuration: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  // figure out the timestamp for this thumb, int he format mm:ss:milliseconds (2 digits)
  // the value is a number from 0..1, the duration is the novie's total duration

  const secondsIn = Math.floor(value * totalDuration);
  const minutes = Math.floor(secondsIn / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsIn % 60).toString().padStart(2, "0");
  const milliseconds = Math.floor((value * totalDuration - secondsIn) * 100);
  const timestamp = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;

  return (
    <Slider.Thumb
      className={cn("block relative  h-10 w-5 bg-yellow-500", className)}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
    >
      <div className="flex w-full justify-center items-center bg-yellow-500 h-full space-x-[1px]">
        <div className="w-[1px] h-4 bg-black" />
        <div className="w-[1px] h-4 bg-black" />
      </div>
      {isDragging && <TimeStamp timestamp={timestamp} />}
    </Slider.Thumb>
  );
};

const TimeStamp = ({ timestamp }: { timestamp: string }) => {
  return (
    <div className="absolute text-sm font-mono -top-9  -translate-x-1/2 bg-background px-2 py-1 rounded">
      {timestamp}
    </div>
  );
};
