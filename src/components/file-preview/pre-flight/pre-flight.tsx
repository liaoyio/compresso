import { VideoPreviewContainer } from "@/components/comparison-slider/comparison-slider-container";
import {
  CompressoFile,
  useCompressoFiles,
} from "@/lib/store/use-compresso-files";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Trimmer, TrimmerUpdate } from "./trimmer";
import { ChevronRight, PauseIcon, PlayIcon, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PreFlight = ({
  file,
  assetUrl,
}: {
  file: CompressoFile;
  assetUrl: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    videoRef.current?.addEventListener("loadedmetadata", () => {
      setDuration(videoRef.current?.duration ?? 0);
    });
  }, []);
  const { setTrims, setFileStatus } = useCompressoFiles();

  // the user is adjusting the trimmer
  const handleTrimmerUpdate = (update: TrimmerUpdate) => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);

    setTrims(file.id, update.startSecs, update.endSecs);
  };

  // the user pressed play/pause
  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (
      video.paused &&
      file.overrideConfig?.trimStart !== undefined &&
      file.overrideConfig?.trimEnd !== undefined
    ) {
      video.currentTime = file.overrideConfig.trimStart;
    }

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    updateTime();
  };

  // the user is seeking
  const handleSeek = (percentage: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = percentage * duration;
    setCurrentTime(videoRef.current.currentTime);
  };

  // update the time so the playhead moves
  const updateTime = () => {
    const video = videoRef.current;
    if (!video || video.paused) return;

    const { trimStart, trimEnd } = file.overrideConfig ?? {};

    if (trimStart !== undefined && trimEnd !== undefined) {
      if (video.currentTime < trimStart) {
        video.currentTime = trimStart;
      } else if (video.currentTime > trimEnd) {
        video.currentTime = trimStart;
      }
    }

    setCurrentTime(video.currentTime);
    requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    updateTime();
  }, []);

  const newDuration =
    file.overrideConfig?.trimStart !== undefined &&
    file.overrideConfig?.trimEnd !== undefined
      ? file.overrideConfig.trimEnd - file.overrideConfig.trimStart
      : duration;

  const wasTrimmed = newDuration !== duration;
  const newDurationString = secondsToTimeStampString(newDuration);

  return (
    <VideoPreviewContainer className="flex-col" key={assetUrl}>
      <div className="flex relative flex-col gap-2 p-5 pt-0 w-full items-center justify-center ">
        <div className="text-3xl self-start font-semibold">剪辑</div>
        <div className={cn("max-h-[calc(100vh-200px)]")}>
          <video
            ref={videoRef}
            playsInline
            className="w-full h-full object-contain bg-black rounded"
            src={assetUrl}
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <button
            onClick={handlePlay}
            className="hover:bg-foreground/5 px-4 py-2 rounded"
          >
            {isPlaying ? (
              <PauseIcon className="fill-foreground w-5 h-5" />
            ) : (
              <PlayIcon className="fill-foreground w-5 h-5" />
            )}
          </button>
          <Trimmer
            duration={duration}
            onValueChange={handleTrimmerUpdate}
            onSeek={handleSeek}
            currentTime={currentTime}
            defaultStart={file.overrideConfig?.trimStart ?? 0}
            defaultEnd={file.overrideConfig?.trimEnd ?? duration}
          />
        </div>
        <div className="flex gap-2 items-center w-full justify-end ">
          <div className="text-sm font-mono flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded">
            <TimerIcon className="w-3 h-3 opacity-60" />
            <div className="opacity-80">{newDurationString}</div>
          </div>

          <Button
            variant="onboarding"
            onClick={() => setFileStatus(file.id, "waiting")}
            className="flex items-center gap-1"
          >
            <div>{wasTrimmed ? "剪辑并压缩" : "压缩"}</div>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </Button>
        </div>
      </div>
    </VideoPreviewContainer>
  );
};

const secondsToTimeStampString = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 100);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
};
