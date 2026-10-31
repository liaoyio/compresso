import { OptimizeProgress } from "./types";

export const parseFFmpegStatusLine = (
  line: string,
  lastProgress: OptimizeProgress,
  totalDuration: number | null
) => {
  const timeMatch = line.match(/time=(\d{2}):(\d{2}):(\d{2})\.\d{2}/);
  const dupFramesMatch = line.match(/dup_frames=(\d+)/);
  const speedMatch = line.match(/speed=(\d+(?:\.\d+)?)x/);
  const fpsMatch = line.match(/fps=(\d+\.\d+)/);
  const totalSizeMatch = line.match(/total_size=(\d+)/);
  const progressEndMatch = line.match(/progress=end/);

  if (progressEndMatch) {
    return { ...lastProgress, progress: 1 };
  }

  if (dupFramesMatch) {
    lastProgress.dupFrames = parseInt(dupFramesMatch[1]);
  }

  if (speedMatch) {
    lastProgress.speed = parseFloat(speedMatch[1]);
    // console.log("sff: speed:", line);
  }

  if (fpsMatch) {
    lastProgress.fps = parseFloat(fpsMatch[1]);
  }

  if (totalSizeMatch) {
    lastProgress.totalSize = parseInt(totalSizeMatch[1]);
  }

  if (timeMatch) {
    const [, hours, minutes, seconds] = timeMatch;
    const currentTime =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);

    if (totalDuration === null) {
      // silently fail
      console.warn("Total duration is not available");
      return lastProgress;
    }

    const progress = Math.min(currentTime / totalDuration);

    lastProgress.progress = progress;
  }

  return lastProgress;
};
