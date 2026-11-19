import { useRef, useState } from "react";
import { PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useCompressoStore from "@/lib/store/compresso-store";
import { IoIosCloseCircle } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

export const EmptyPreview = () => {
  // const { isLoading, didCompleteSurvey } = useSurvey("signup");
  // const surveyIsloadingOrCompleted = isLoading || didCompleteSurvey;
  const { hasDismissedGettingStarted } = useGettingStarted();

  return (
    <div className="flex flex-col justify-start items-center w-full h-full relative">
      {/* {!surveyIsloadingOrCompleted && (
        <ScrollArea>
          <SignupSurvey onCompleted={() => {}} />
        </ScrollArea>
      )} */}

      <AnimatePresence>
        {!hasDismissedGettingStarted && (
          <>
            <OnboardingVideo />
          </>
        )}
      </AnimatePresence>


    </div>
  );
};

const OnboardingVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { setHasDismissedGettingStarted } = useGettingStarted();

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    if (nextPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setIsPlaying(nextPlaying);
  };

  return (
    <motion.div
      className="w-full overflow-clip"
      initial={{
        
        opacity: 0.7,
        y: "-10%",
        
      }}
      animate={{
        
        opacity: 1,
        y: 0,
    
      }}
      exit={{
        
        opacity: 0.0,
        y: "-10%",
        
      }}
      transition={{
        ease: [0.19, 1, 0.12, 1],
        duration: 0.5,
      }}

    >
      <div
        className="p-5 m-5 max-h-screen
        bg-stone-800 text-stone-300
        dark:bg-stone-300 dark:text-stone-950
       rounded-xl border shadow-lg border-foreground/5
       "
      >
        <div className="w-full flex justify-between items-start opacity-80">
          <h1 className="text-xl tracking-tighter font-bold shrink">
            新手引导
          </h1>
          <ul className="">
            <li>拖入一个视频</li>
            <li>点击「在文件夹中显示」</li>
            <li>打开设置</li>
            <li>试试迷你模式</li>
          </ul>

          <button
            className="opacity-50 hover:opacity-100"
            onClick={() => setHasDismissedGettingStarted(true)}
          >
            <IoIosCloseCircle className="h-8 w-8" />
          </button>
        </div>
        <div className="rounded-xl  relative mt-4 bg-black overflow-clip">
          <video
            onClick={togglePlay}
            ref={videoRef}
            controls={isPlaying}
            className={cn(
              "h-full w-full aspect-video",
              isPlaying ? "opacity-100" : "opacity-50"
            )}
            src={
              import.meta.env.VITE_ASSETS_ROOT +
              "/onboarding/onboarding-demo_smaller.mp4"
            }
          />

          {!isPlaying && (
            <button
              onClick={togglePlay}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              )}
            >
              <div className="px-5 py-5 bg-black/50 transition-all hover:bg-black/100 rounded-full">
                <PlayIcon className="fill-foreground" />
              </div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const useGettingStarted = () => {
  const setHasDismissedGettingStarted = useCompressoStore(
    (state) => state.setHasDismissedGettingStarted
  );
  const hasDismissedGettingStarted = useCompressoStore(
    (state) => state.hasDismissedGettingStarted
  );

  return { setHasDismissedGettingStarted, hasDismissedGettingStarted };
};
