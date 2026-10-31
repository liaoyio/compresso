import { createFilterComplex } from "./create-video-filters";
import {
  defaultVideoBitrateKbps,
  OptimizeConfig,
  RateControlMode,
} from "./types";
import { calculateTargetBitratesKbps } from "./bitrate-utils";

export const createFFmpegCommand = ({
  inputFilePath,
  outputPath,
  config,
  watermarkPath,
  mediaDurationSeconds,
  sourceHasAudio,
}: {
  inputFilePath: string;
  outputPath: string;
  config: OptimizeConfig;
  watermarkPath: string | null;
  mediaDurationSeconds?: number;
  sourceHasAudio?: boolean;
}) => {
  let codec;
  let tag;
  let crf;
  let movflags: string[] | null = null;

  const format = config.formats[0];

  // The CRF ranges from 0-max, with 0 being lossless and max being the worst quality possible.
  const mp4CRFMax = 51;
  const webmCRFMax = 63;
  const crfFraction = config.crfFraction ?? 0.5;

  const needsWatermark = watermarkPath !== null;
  const removesAudio =
    config.removeAudio || (config.speedFraction && config.speedFraction !== 1);
  const outputsAudio = !removesAudio && (sourceHasAudio ?? true);
  const usesTargetSize = !!(
    config.useTargetSize &&
    config.targetSizeBytes &&
    mediaDurationSeconds
  );
  const rateControlMode: RateControlMode = usesTargetSize
    ? "bitrate"
    : config.rateControlMode ?? "crf";

  switch (format) {
    case "mp4":
      codec = "libx264";
      tag = "avc1";
      crf = Math.round((1 - crfFraction) * mp4CRFMax);
      movflags = config.webStreamable ? ["-movflags", "+faststart"] : null;
      break;
    case "webm":
      codec = "libvpx";
      tag = "vp9";
      crf = Math.round((1 - crfFraction) * webmCRFMax);
      movflags = null;
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const targetBitrates = usesTargetSize
    ? calculateTargetBitratesKbps({
        targetSizeBytes: config.targetSizeBytes!,
        durationSeconds: mediaDurationSeconds!,
        hasAudio: outputsAudio,
        bitrateScale: config.targetBitrateScale,
      })
    : undefined;
  const videoBitrateKbps =
    targetBitrates?.videoBitrateKbps ??
    config.videoBitrateKbps ??
    defaultVideoBitrateKbps;

  const videoRateArgs =
    rateControlMode === "bitrate"
      ? ["-b:v", `${videoBitrateKbps}k`]
      : [
          "-crf",
          `${crf}`,

          // enable variable bitrate
          "-b:v",
          "0",
        ];

  const audioRateArgs =
    usesTargetSize && outputsAudio && targetBitrates?.audioBitrateKbps
      ? ["-b:a", `${targetBitrates.audioBitrateKbps}k`]
      : [];

  console.log("RETRY: Actual crf", rateControlMode === "crf" ? crf : null);
  console.log(
    "Target bitrate:",
    rateControlMode === "bitrate" ? videoBitrateKbps : null
  );

  const ffmpegArgs: string[] = [
    "-i",
    inputFilePath,

    ...(needsWatermark ? ["-i", watermarkPath] : []),

    "-c:v",
    codec,

    "-tag:v",
    tag,

    ...(removesAudio ? ["-an"] : []),

    // this breaks maco screen recordings and other videos, but only in dev mode?
    ...(movflags ? movflags : []),

    ...videoRateArgs,
    ...audioRateArgs,

    "-preset",
    config.speed ?? "veryfast",

    // trim the video
    ...(config.trimStart ? ["-ss", `${config.trimStart}`] : []),
    ...(config.trimEnd ? ["-to", `${config.trimEnd}`] : []),

    ...createFilterComplex({ config, needsWatermark }),

    ...(config.maxFramerate ? ["-fpsmax", `${config.maxFramerate}`] : []),

    ...(config.preserveMetadata ? ["-map_metadata", "0"] : []),

    "-progress",
    "-",

    "-y",

    ...(config.threadCount ? ["-threads", `${config.threadCount}`] : []),

    outputPath,
  ];

  console.log("ffmpegArgs: \n\nffmpeg", ffmpegArgs.join(" "));
  return ffmpegArgs;
};
