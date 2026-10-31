import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const DestinationSelect = () => {
  return (
    <Select>
      <SelectTrigger className="max-w-sm">
        <SelectValue placeholder="Save to..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Presets</SelectLabel>
          <SelectItem value="preset1">Replace</SelectItem>
          <SelectItem value="preset2">Overme</SelectItem>
          <SelectItem value="preset3">Preset 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
