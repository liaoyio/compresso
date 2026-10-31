import { calculateEstimatedCompressedSize } from "@/components/file-list/file-item";
import { OptimizeConfig } from "./types";

export const TargetSizeConfig = {
  // smallest allowed bitrate multiplier for target-size retries
  minBitrateScale: 0.5,
  // how much to reduce bitrate by each retry
  bitrateReductionStep: 0.05,

  // how many samples to take before we consider the target size exceeded
  // these vary a bit, especially in the beginning
  minSamplesBeforeRetry: 5,
};

export type TargetSizeOptions = {
  maxSizeBytes: number;
};

export class TargetEstimator {
  private samples: number[] = [];
  private maxSizeBytes: number;

  constructor(options: TargetSizeOptions) {
    this.maxSizeBytes = options.maxSizeBytes;
  }

  // Add a sample to the estimator
  public addSample(totalSize: number, progress: number) {
    const estimatedSize = calculateEstimatedCompressedSize(totalSize, progress);
    if (estimatedSize) {
      this.samples.push(estimatedSize);
    }
  }

  // Returns true if the target size has been exceeded and we have enough samples to be confident
  public isTargetSizeExceeded() {
    const avgSampleSize =
      this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    return (
      avgSampleSize &&
      avgSampleSize > this.maxSizeBytes &&
      this.samples.length >= TargetSizeConfig.minSamplesBeforeRetry
    );
  }
}

/**
 * Adjusts the config for target size by reducing bitrate in small steps
 * each time it is called.
 */
export const optimizeConfigForTargetSize = (
  config: OptimizeConfig,
  overrideConfig?: Partial<OptimizeConfig>
) => {
  // get the current values
  const targetBitrateScale =
    overrideConfig?.targetBitrateScale ?? config.targetBitrateScale ?? 1;

  // adjust the values for smaller file size
  const newConfig = {
    ...config,
    rateControlMode: "bitrate" as const,
    targetBitrateScale: Math.max(
      TargetSizeConfig.minBitrateScale,
      targetBitrateScale - TargetSizeConfig.bitrateReductionStep
    ),
  };

  return newConfig;
};
