export type NumericSetting = "maxFramerate" | "downscaleFraction" | "speedFraction";

type NumericSettingDefinition = {
  label: string;
  inputLabel: string;
  unit: string;
  displayFactor: number;
  defaultCustomValue: number;
  trackingEvent: string;
  options: { id: string; label: string; value: number | undefined }[];
};

export const numericSettings: Record<NumericSetting, NumericSettingDefinition> = {
  maxFramerate: {
    label: "Frame rate",
    inputLabel: "Custom frame rate",
    unit: "fps",
    displayFactor: 1,
    defaultCustomValue: 30,
    trackingEvent: "max_framerate_setting",
    options: [
      { id: "original", label: "Keep framerate", value: undefined },
      ...[24, 30, 60].map((value) => ({
        id: String(value),
        label: `${value} fps`,
        value,
      })),
    ],
  },
  downscaleFraction: {
    label: "Scale",
    inputLabel: "Custom scale",
    unit: "%",
    displayFactor: 100,
    defaultCustomValue: 0.5,
    trackingEvent: "downscale_fraction_setting",
    options: [
      { id: "original", label: "Keep scale", value: undefined },
      ...[10, 25, 50, 75].map((percent) => ({
        id: String(percent / 100),
        label: `${percent}% scale`,
        value: percent / 100,
      })),
    ],
  },
  speedFraction: {
    label: "Video speed",
    inputLabel: "Custom speed",
    unit: "×",
    displayFactor: 1,
    defaultCustomValue: 1,
    trackingEvent: "video_speed_setting",
    options: [
      { id: "original", label: "Keep speed", value: 1 },
      ...[0.5, 1.5, 2, 5, 10].map((value) => ({
        id: String(value),
        label: `${value}× speed`,
        value,
      })),
    ],
  },
};

export const getNumericSettingSelection = (
  setting: NumericSetting,
  value: number | undefined,
  isCustom: boolean
) => {
  if (isCustom) return "custom";
  const { options } = numericSettings[setting];
  if (value === undefined) return options[0].id;
  return options.find((option) => option.value === value)?.id ?? "custom";
};
