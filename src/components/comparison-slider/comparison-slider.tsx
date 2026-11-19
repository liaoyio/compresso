import { cn } from "@/lib/utils";
import { ReactCompareSlider } from "react-compare-slider";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { useComparisonContextMenu } from "./create-comparison-context-menu";

/*
  Shows a comparison slider in most cases. 
  If the video was trimmed, we disable the slider, 
  hide the slider, and slide it all the way to the left 
  so only the trimmed video is shown.
*/

// seek video relatively to the duration with 0.5 being the middle
const seekVideoRelatively = (
  videoRef: React.RefObject<HTMLVideoElement>,
  value: number
) => {
  if (videoRef.current) {
    const duration = videoRef.current.duration;
    // if duration is non-finite return
    if (!duration) return;
    const time = duration * value;
    videoRef.current.currentTime = time;
  }
};

export const ComparisonSlider = ({
  sourceUrl,
  outputUrl,
  wasTrimmed,
  progress,
}: {
  sourceUrl: string | null;
  outputUrl?: string | null;
  wasTrimmed?: boolean;
  progress: number | null | undefined;
  sourceSize: number | null;
  outputSize: number | null | undefined;
  fileName?: string | null;
}) => {
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const outputVideoRef = useRef<HTMLVideoElement>(null);
  const progressVideoRef = useRef<HTMLVideoElement>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { createContextMenu } = useComparisonContextMenu();

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (sourceVideoRef.current && outputVideoRef.current) {
      seekVideoRelatively(sourceVideoRef, value);
      seekVideoRelatively(outputVideoRef, value);
    }
  };

  const updatePlayheadContinuously = () => {
    const outputVideo = outputVideoRef.current;
    if (!outputVideo) return;

    const duration = outputVideo.duration;
    if (!isFinite(duration)) return;

    if (!outputVideo.paused) {
      const time = outputVideo.currentTime;
      const pct = time / duration;
      
      setSliderValue(pct);

      requestAnimationFrame(updatePlayheadContinuously);
    }
  };

  const startVideos = () => {
    if (!sourceVideoRef.current || !outputVideoRef.current) {
      return;
    }
    setIsPlaying(true);

    // if the video was trimmed, we don't want to play the source video
    // as the audio will be wrong and it's not visible anyway
    if (!wasTrimmed) {
      sourceVideoRef.current.play();
    }
    outputVideoRef.current.play();
    setTimeout(() => {
      requestAnimationFrame(updatePlayheadContinuously);
    }, 100);
  };

  const pauseVideos = () => {
    setIsPlaying(false);
    if (sourceVideoRef.current && outputVideoRef.current) {
      sourceVideoRef.current.pause();
      outputVideoRef.current.pause();
    }
  };

  const togglePlaying = () => {
    console.log("togglePlaying");
    if (sourceVideoRef.current && outputVideoRef.current) {
      if (!isPlaying) {
        startVideos();
      } else {
        pauseVideos();
      }
    }
  };

  const shouldShowComparison = !!sourceUrl && !!outputUrl;
  const shouldShowProgress = !!progress && !!sourceUrl;
  // const inProgress = (progress && !outputUrl) === true;
  // const isDone = progress === 1;

  // Progress: Seek to current
  useEffect(() => {
    if (progress && !outputUrl) {
      setSliderValue(progress);
      seekVideoRelatively(progressVideoRef, progress);
    }
  }, [progress, outputUrl]);

  useVideoLoadedMetadata(outputVideoRef, () => {
    setTimeout(() => {
      if (outputVideoRef.current && sourceVideoRef.current) {
        outputVideoRef.current.currentTime = 0;
        sourceVideoRef.current.currentTime = 0;
      }
    }, 100);
  });

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    await createContextMenu();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex flex-col   gap-2 p-5 pt-0 w-full items-center justify-center "
    >
      <div className=" w-full h-[60vh] p-1 border bg-foreground/5 rounded-lg relative">
        {shouldShowComparison && (
          <ReactCompareSlider
            handle={wasTrimmed ? <></> : undefined}
            position={wasTrimmed ? 0 : undefined}
            disabled={wasTrimmed}
            className={cn(
              "rounded w-full h-full",
              "absolute top-0 left-0",
              "overflow-hidden"
            )}
            itemOne={
              <video
                playsInline
                ref={sourceVideoRef}
                className="w-full h-full object-contain bg-black"
                src={sourceUrl}
              />
            }
            itemTwo={
              <video
                playsInline
                ref={outputVideoRef}
                className="w-full h-full object-contain bg-black"
                src={outputUrl}
              />
            }
          />
        )}

        {/* if in progress */}

        {shouldShowProgress && progress !== 1 && (
          <div className="w-full h-full overflow-hidden rounded">
            <video
              playsInline
              ref={progressVideoRef}
              className="w-full h-full object-contain opacity-50  "
              src={sourceUrl}
            />
          </div>
        )}
      </div>

      <div className="w-full flex pt-1 items-center gap-4">
        <button onClick={togglePlaying}>
          {isPlaying ? (
            <PauseIcon className="w-5 h-5 fill-foreground" />
          ) : (
            <PlayIcon className="w-5 h-5 fill-foreground" />
          )}
        </button>

        <Slider.Root
          className="relative flex items-center select-none w-full touch-none h-5"
          min={0}
          max={1}
          step={0.01}
          value={[sliderValue]}
          onValueChange={(value) => handleSliderChange(value[0])}
        >
          <Slider.Track className="bg-foreground/10 relative grow rounded-full h-[3px] w-full">
            <Slider.Range className="absolute bg-foreground/20 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-1 h-4 rounded-full bg-white
             dark:bg-gray-400 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
            aria-label="时间轴"
          />
        </Slider.Root>
      </div>
    </div>
  );
};

const useVideoLoadedMetadata = (
  videoRef: React.RefObject<HTMLVideoElement>,
  callback: () => void
) => {
  useEffect(() => {
    const video = videoRef.current;

    const handleLoaded = () => {
      callback();
    };

    video?.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      video?.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [videoRef, callback]);
};
