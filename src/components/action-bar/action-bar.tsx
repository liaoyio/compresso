import { Spacer } from "../spacer";
import { PresetSelect } from "./preset-select";

export const ActionBar = () => {
  return (
    <div className="flex gap-2 p-2">
      <div className="flex justify-end w-full">
        <PresetSelect />
      </div>
      {/* <DestinationSelect /> */}
      <Spacer />
      {/* <CompressButton /> */}
    </div>
  );
};
