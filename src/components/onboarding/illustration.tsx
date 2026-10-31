/*
We're drawing illustrations with framer motion here! Not sure if it's the best tool for the job, but it's fun!
 */

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  CRFSetting,
  RemoveAudioSetting,
  SpeedSetting,
  WebStreamableSetting,
  DownscaleFractionSetting,
  VideoSpeedSetting,
  MaxFramerateSetting,
  FileFormatSettings,
} from "../settings-sidebar/settings-sidebar";
import Marquee from "../magicui/marquee";

const AllSettingsComponents = [
  { title: "Compression speed vs Quality", component: SpeedSetting },
  { title: "Scale down", component: DownscaleFractionSetting },
  { title: "Speed up video", component: VideoSpeedSetting },
  { title: "Set a maxium framerate", component: MaxFramerateSetting },
  { title: "Remove Audio", component: RemoveAudioSetting },
  { title: "Make the video streamable", component: WebStreamableSetting },
  { title: "Set a quality level", component: CRFSetting },
  { title: "Choose a file format", component: FileFormatSettings },
];
export const SettingsIllustration = () => {
  return (
    <div className=" ">
      {/* <MarqueeDemo/> */}
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {AllSettingsComponents.map((Component, index) => (
          <DisabledSetting key={index}>
            <div className="text-sm mb-5 text-foreground/50">
              {Component.title}
            </div>
            <Component.component />
          </DisabledSetting>
        ))}
      </Marquee>
    </div>
  );
};

const DisabledSetting = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="p-5 scale-[75%] min-w-[200px]  bg-foreground/5 w-full  dark:bg-black
   saturate-0 pointer-events-none rounded-2xl border"
    >
      {children}
    </div>
  );
};

export const BatchIllustration = () => {
  return (
    <Group>
      <motion.div animate={{}}>
        <Block className="w-1/3 h-6" />
      </motion.div>
      <motion.div animate={{}}>
        <Block className="w-1/2 h-6" />
      </motion.div>
      <motion.div animate={{}}>
        <Block className="w-1/1 h-6" />
      </motion.div>
      <motion.div>
        <Block className="w-1/4 h-6" />
      </motion.div>
      <motion.div>
        <Block className="w-1/3 h-6" />
      </motion.div>
    </Group>
  );
};

export const MiniIllustration = () => {
  return (
    <div className="flex flex-col items-center justify-center  h-full">
      <Group>
        <motion.div
          initial={{ width: "20em", height: "20em" }}
          animate={{ width: "15em", height: "10em" }}
          transition={{ duration: 5 }}
          className="relative w-full h-full block"
        >
          <Block className=" " />
          {/* traffic light */}
          <div className="absolute top-3 left-3 w-full h-full flex gap-2">
            <div className="w-4 h-4 rounded-full bg-background" />
            <div className="w-4 h-4 rounded-full bg-background" />
            <div className="w-4 h-4 rounded-full bg-background" />
          </div>
        </motion.div>
      </Group>
    </div>
  );
};

export const CompareIllustration = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
     
    </div>
  );
};

const Group = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("flex flex-col gap-3 ", className)}>{children}</div>
  );
};

const Block = ({ className }: { className: string }) => {
  return (
    <div className={cn("w-full bg-foreground h-full rounded", className)} />
  );
};
