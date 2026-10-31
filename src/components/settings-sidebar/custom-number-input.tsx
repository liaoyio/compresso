import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export const CustomNumberInput = ({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(value.toString());

  useEffect(() => setDraft(value.toString()), [value]);

  return (
    <div className="flex items-center gap-2 relative">
      <Input
        aria-label={label}
        type="number"
        className="text-right pr-2"
        min={0}
        step="any"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          const nextValue = event.target.valueAsNumber;
          if (Number.isFinite(nextValue) && nextValue > 0) {
            onChange(nextValue);
          }
        }}
        onBlur={() => setDraft(value.toString())}
      />
      <span>{unit}</span>
    </div>
  );
};
