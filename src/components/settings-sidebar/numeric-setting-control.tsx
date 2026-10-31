import { Fragment, ReactNode } from "react";
import useCompressoStore from "@/lib/store/compresso-store";
import {
  getNumericSettingSelection,
  NumericSetting,
  numericSettings,
} from "@/lib/store/numeric-settings";
import { useTrackHasUsed } from "@/lib/use-track-appearance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { CustomNumberInput } from "./custom-number-input";

export const NumericSettingControl = ({
  setting,
  leadingControl,
}: {
  setting: NumericSetting;
  leadingControl?: ReactNode;
}) => {
  const definition = numericSettings[setting];
  const value = useCompressoStore((state) => state.config[setting]);
  const customMode = useCompressoStore((state) => state.customModes[setting] ?? false);
  const selectSetting = useCompressoStore((state) => state.selectNumericSetting);
  const setCustomValue = useCompressoStore((state) => state.setCustomValue);
  const trackHasUsed = useTrackHasUsed();
  const selection = getNumericSettingSelection(setting, value, customMode);

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <div className="flex gap-2 w-full">
        {leadingControl}
        <Select
          value={selection}
          onValueChange={(selection) => {
            selectSetting(setting, selection);
            trackHasUsed(definition.trackingEvent);
          }}
        >
          <SelectTrigger className="w-full" aria-label={definition.label}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {definition.options.map((option, index) => (
              <Fragment key={option.id}>
                <SelectItem value={option.id}>{option.label}</SelectItem>
                {index === 0 && <Separator />}
              </Fragment>
            ))}
            <SelectItem value="custom">Custom...</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selection === "custom" && (
        <CustomNumberInput
          label={definition.inputLabel}
          unit={definition.unit}
          value={Number(
            ((value ?? definition.defaultCustomValue) * definition.displayFactor).toPrecision(12)
          )}
          onChange={(value) => setCustomValue(setting, value / definition.displayFactor)}
        />
      )}
    </div>
  );
};
