import { motion } from "framer-motion";
import MotionNumber from "motion-number";
import { FFSummary } from "@/lib/probe/get-media-info";
import { cn } from "@/lib/utils";
import byteSize from "byte-size";
import { FileBadge, getVariant } from "@/components/file-badge";
import { ArrowDownIcon } from "lucide-react";

export const PreviewDataContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("flex gap-2 px-4 pb-4 overflow-hidden", className)}>
      {children}
    </div>
  );
};

export const PreviewBytes = ({ bytes }: { bytes: number }) => {
  const human = byteSize(bytes, { locale: "en-US" }).value;
  const unit = byteSize(bytes).unit;

  return (
    <div
      className="text-sm
    items-center
     flex space-x-2 md:text-2xl font-bold"
    >
      <MotionNumber value={human} />
      <div className="opacity-50  font-normal">{unit}</div>
    </div>
  );
};

export const PreviewTopTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="text-sm opacity-50 font-bold">{children}</div>;
};

export const PreviewDataItem = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-foreground/5 p-5 flex-col space-y-4 rounded-lg w-full overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export const PreviewPctSmaller = ({
  pctSmaller,
  isDone,
}: {
  pctSmaller: number;
  isDone: boolean;
}) => {
  // isDone = false
  return (
    <motion.div
      animate={{
        y: isDone ? 0 : 100,
        transition: {
          duration: 0.25,
          ease: "circOut",
        },
      }}
      // className="text-xs md:text-[1rem]  bg-lime-700 border dark:border-lime-900   text-lime-200 px-2 py-1 rounded-lg flex items-center gap-1"
    >
      <FileBadge variant={getVariant("done")}>
        <ArrowDownIcon className="w-3 h-3 inline-block mr-1" />

        <MotionNumber
          className=""
          value={pctSmaller}
          // after={() => <div className="inline-block">smaller</div>}
          format={{ style: "percent", maximumFractionDigits: 0 }}
        />
      </FileBadge>
    </motion.div>
  );
};

export const PreviewProgress = ({ speed }: { speed: number }) => {
  return (
    <DataItems>
      <DataItem>
        <DataData>{speed} 倍速</DataData>
      </DataItem>
    </DataItems>
  );
};

export const PreviewDataSummary = ({ summary }: { summary: FFSummary }) => {
  //   const duration = parseFloat(summary.duration?.toString() ?? "0");
  const fps = summary.videoFps;
  //   const size = summary.size;
  const codec = summary.videoCodec;
  const audioCodec = summary.audioCodec;
  //   const audioSampleRate = summary.audioSampleRate;
  //   const hasAudio = summary.hasAudio;
  //   const hasVideo = summary.hasVideo;
  const extension = summary.fileExtension;

  return (
    <DataItems>
      {/* <DataItem>
        <DataData>{duration.toFixed(0)}s</DataData>
      </DataItem> */}
      <DataItem>
        <DataData>{fps?.toFixed(0)} fps</DataData>
      </DataItem>
      <DataItem>
        {audioCodec && <DataData>{audioCodec}</DataData>}
        {!audioCodec && <DataData>无音频</DataData>}
      </DataItem>
      <DataItem>
        {codec && <DataData>{codec}</DataData>}
        {!codec && <DataData>无视频</DataData>}
      </DataItem>
      <DataItem>
        <DataData>{extension}</DataData>
      </DataItem>
    </DataItems>
  );
};

const DataItems = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-sm flex items-center flex-wrap justify-start gap-1 mt-2 ">
      {children}
    </div>
  );
};

const DataItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[0.7rem] flex items-center space-x-[2px] bg-foreground/5 text-foreground/50 rounded-full px-2">
      {children}
    </div>
  );
};

const DataData = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};
