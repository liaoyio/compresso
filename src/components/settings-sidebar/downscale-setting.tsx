import { DownscaleType, OptimizeConfig } from "@/lib/optimizer/types";
import { useOptimizeConfig } from "@/lib/store/store-hooks";
import { useTrackHasUsed } from "@/lib/use-track-appearance";

import { CgArrowsShrinkH } from "react-icons/cg";
import { SettingWrapper, SettingIcon } from "../setting-root";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Input } from "../ui/input";
import { NumericSettingControl } from "./numeric-setting-control";

export const DownscaleSetting = () => {
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();
  const trackHasUsed = useTrackHasUsed();

  const handleDownscaleTypeChange = (downscaleType: DownscaleType) => {
    setOptimizeConfig({
      ...optimizeConfig,
      downscaleType,
    });
    trackHasUsed("downscale_setting");
  };

  const downscaleType = optimizeConfig.downscaleType ?? "relative";

  const typeSelect = (
    <Select value={downscaleType} onValueChange={handleDownscaleTypeChange}>
      <SelectTrigger className="w-1/3" aria-label="Scale unit">
        {{ relative: "%", width: "W", height: "H" }[downscaleType]}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relative">Relative</SelectItem>
        <SelectItem value="width">Width</SelectItem>
        <SelectItem value="height">Height</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <SettingWrapper>
      <SettingIcon>
        <CgArrowsShrinkH />
      </SettingIcon>
      {downscaleType === "relative" ? (
        <NumericSettingControl setting="downscaleFraction" leadingControl={typeSelect} />
      ) : (
        <div className="flex gap-2 w-full min-w-0">
          {typeSelect}
          <DownscaleAbsoluteSelect type={downscaleType} />
        </div>
      )}
    </SettingWrapper>
  );
};

const DownscaleAbsoluteSelect = ({ type }: { type: "width" | "height" }) => {
  const trackHasUsed = useTrackHasUsed();
  const { optimizeConfig, setOptimizeConfig } = useOptimizeConfig();

  let downscaleKey: keyof OptimizeConfig;

  if (type === "width") {
    downscaleKey = "downscaleWidth";
  } else {
    downscaleKey = "downscaleHeight";
  }

  const downscaleValue = optimizeConfig[downscaleKey];
  const handleChange = (absolute: string) => {
    const number = parseInt(absolute);

    if (isNaN(number)) {
      return;
    }

    setOptimizeConfig({
      ...optimizeConfig,
      [downscaleKey]: number,
    });

    trackHasUsed("downscale_absolute_setting");
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <Input
        className="text-right h-8"
        type="number"
        step={10}
        value={downscaleValue}
        onChange={(e) => handleChange(e.target.value)}
      />
      <span className="text-sm opacity-50">px</span>
    </div>
  );
};
