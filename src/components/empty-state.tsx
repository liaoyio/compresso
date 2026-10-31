import { ArrowUpFromLine } from "lucide-react";
import { Spacer } from "./spacer";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { selectFiles } from "@/lib/select-files";

export const EmptyState = ({
  onSelectFiles,
}: {
  onSelectFiles: (paths: string[]) => void;
}) => {
  const handleOpenFileDialog = async () => {
    const paths = await selectFiles();
    if (!paths) return;
    onSelectFiles(paths);
  };

  
  return (
    <div className="flex flex-col items-center justify-center h-full saturate-0">
      <Spacer />
      <div className="flex flex-col items-center justify-center gap-5">
        <ArrowUpFromLine
          className={cn(
            //   "w-10 h-10 transition ease-in-out translate-y-5",
            "w-7 h-7 opacity-50",
            "transition ease-in-out duration-300 "
            // isDragActive && "translate-y-3 scale-90"
          )}
        />
        <div className="opacity-50">
          Drag and drop video files to start compressing
        </div>

        <Button className=" cursor-pointer" onClick={handleOpenFileDialog}>
          Select Files
        </Button>
      </div>
      <Spacer />
    </div>
  );
};
