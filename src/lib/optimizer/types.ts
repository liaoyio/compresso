export const AllSpeeds = [
  "ultrafast",
  "superfast",
  "veryfast",
  "fast",
  "medium",
  "slow",
  "slower",
  "veryslow",
];

export type OptimizeSpeed = (typeof AllSpeeds)[number];

export const defaultCRFFraction = 0.42; // this results in crf 30, like the web.
export const defaultVideoBitrateKbps = 2500;

export type RateControlMode = "crf" | "bitrate";

export const defaultConfig: OptimizeConfig = {
  formats: ["mp4"],
  rateControlMode: "crf",
  crfFraction: defaultCRFFraction,
  videoBitrateKbps: defaultVideoBitrateKbps,
  speed: "veryfast",
  overwrite: false,
  overwrite_postfix: "_smaller",
  downscaleFraction: undefined,
  downscaleType: "relative",
  downscaleWidth: 800,
  downscaleHeight: 600,
  webStreamable: true,
  maxFramerate: undefined,
  removeAudio: false,
  speedFraction: undefined,
  threadCount: undefined,
  preserveMetadata: undefined,
  targetSizeBytes: undefined,
  useTargetSize: false,
};

export type DownscaleType = "relative" | "width" | "height";

export type OptimizeConfig = {
  formats: string[];
  rateControlMode?: RateControlMode;
  crfFraction?: number;
  videoBitrateKbps?: number;
  speed?: OptimizeSpeed;
  overwrite?: boolean;
  overwrite_postfix?: string;
  downscaleFraction?: number;
  downscaleType?: DownscaleType;
  downscaleWidth?: number;
  downscaleHeight?: number;
  webStreamable?: boolean;
  maxFramerate?: number;
  removeAudio?: boolean;
  speedFraction?: number;
  threadCount?: number;
  preserveMetadata?: boolean;
  trimStart?: number;
  trimEnd?: number;
  targetSizeBytes?: number;
  useTargetSize?: boolean;
  targetBitrateScale?: number;
};

export type OptimizeProgress = {
  progress: number;
  message: string;
  dupFrames: number;
  speed: number;
  fps: number;
  totalSize: number;
  finalPath?: string;
};

export const speedToNumber = (speed: OptimizeSpeed) => {
  return AllSpeeds.indexOf(speed);
};

export const speedFromNumber = (speed: number) => {
  return AllSpeeds[speed] ?? "veryfast";
};

export const minSpeed = 0;
export const maxSpeed = AllSpeeds.length - 1;
