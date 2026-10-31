import { usePresetStore } from "@/lib/store/preset-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { PlusIcon } from "lucide-react";

export const PresetSelect = () => {
  const presets = usePresetStore();

  return (
    <Select>
      <SelectTrigger className="max-w-[100px] flex space-x-1">
        <PlusIcon className="titlebar-icon" />
        {/* <SelectValue placeholder="Preset" /> */}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {presets.map((preset) => (
            <SelectItem value={preset.name}>{preset.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
