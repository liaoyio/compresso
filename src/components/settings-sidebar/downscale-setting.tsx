import { DownscaleType, OptimizeConfig } from "@/lib/optimizer/types";
import { useOptimizeConfig } from "@/lib/store/store-hooks";

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

  const handleDownscaleTypeChange = (downscaleType: DownscaleType) => {
    setOptimizeConfig({
      ...optimizeConfig,
      downscaleType,
    });
  };

  const downscaleType = optimizeConfig.downscaleType ?? "relative";

  const typeSelect = (
    <Select value={downscaleType} onValueChange={handleDownscaleTypeChange}>
      <SelectTrigger className="w-1/3" aria-label="缩放单位">
        {{ relative: "%", width: "W", height: "H" }[downscaleType]}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relative">百分比</SelectItem>
        <SelectItem value="width">宽度</SelectItem>
        <SelectItem value="height">高度</SelectItem>
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
