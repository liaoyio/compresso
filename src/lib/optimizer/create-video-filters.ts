import { OptimizeConfig } from "./types";

export const createFilterComplex = ({
  config,
  needsWatermark,
}: {
  config: OptimizeConfig;
  needsWatermark: boolean;
}): string[] => {
  const filters: string[] = [];

  // watermark
  if (needsWatermark) {
    filters.push(`overlay=x=(main_w-overlay_w-10):y=(main_h-overlay_h-10)`);
  }

  // speed-up
  if (config.speedFraction) {
    filters.push(`setpts=${1 / config.speedFraction}*PTS`);
  }

  // downscale
  switch (config.downscaleType) {
    case "relative":
      if (config.downscaleFraction) {
        filters.push(
          `scale=ceil(iw*${config.downscaleFraction}/2)*2:ceil(ih*${config.downscaleFraction}/2)*2`
        );
      }
      break;
    case "width":
      if (config.downscaleWidth) {
        filters.push(`scale=${config.downscaleWidth}:-2`);
      }
      break;
    case "height":
      if (config.downscaleHeight) {
        filters.push(`scale=-2:${config.downscaleHeight}`);
      }
      break;
  }


  return joinAndAddPrefixIfNotEmpty(filters, "-filter_complex");
};

const joinAndAddPrefixIfNotEmpty = (filters: string[], prefix: string) => {
  if (filters.length > 0) {
    return [prefix, filters.join(",")];
  }
  return [];
};
