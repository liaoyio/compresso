export const defaultAudioBitrateKbps = 128;
export const defaultTargetSizeSafetyFraction = 1;
export const minTargetVideoBitrateKbps = 50;
export const minTargetAudioBitrateKbps = 32;

type TargetVideoBitrateOptions = {
  targetSizeBytes: number;
  durationSeconds: number;
  hasAudio: boolean;
  bitrateScale?: number;
};

export const calculateTargetBitratesKbps = ({
  targetSizeBytes,
  durationSeconds,
  hasAudio,
  bitrateScale = 1,
}: TargetVideoBitrateOptions) => {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return undefined;
  }

  const targetTotalKbps =
    ((targetSizeBytes * 8) / durationSeconds / 1000) *
    defaultTargetSizeSafetyFraction *
    bitrateScale;

  const audioBitrateKbps = hasAudio
    ? Math.min(
        defaultAudioBitrateKbps,
        Math.max(minTargetAudioBitrateKbps, Math.floor(targetTotalKbps * 0.2))
      )
    : 0;

  return {
    videoBitrateKbps: Math.max(
      minTargetVideoBitrateKbps,
      Math.floor(targetTotalKbps - audioBitrateKbps)
    ),
    audioBitrateKbps,
  };
};
