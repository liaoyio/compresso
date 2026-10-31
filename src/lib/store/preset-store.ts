import { defaultConfig, OptimizeConfig } from "../optimizer/types";

export type OptimizePreset = {
  name: string;
  config: OptimizeConfig;
};

export const PresetStore: OptimizePreset[] = [
  {
    name: "Standard",
    config: defaultConfig,
  },
  {
    name: "High Quality",
    config: {
      ...defaultConfig,
      crfFraction: 0.9,
      speed: "medium",
    },
  },
  {
    name: "Small file",
    config: {
      ...defaultConfig,
      crfFraction: 0.2,
      speed: "medium",
    },
  },
  {
    name: "Compress + resize to half size",
    config: {
      ...defaultConfig,
      downscaleFraction: 0.5,
    },
  },
  {
    name: "Fast Compression",
    config: {
      ...defaultConfig,
      crfFraction: 0.5,
      speed: "ultrafast",
    },
  },
];

export const usePresetStore = () => {
  return PresetStore;
};
