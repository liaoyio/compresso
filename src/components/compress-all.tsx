import { useCompressoFiles } from "@/lib/store/use-compresso-files";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const CompressAll = () => {
  const { files, compressAll } = useCompressoFiles();
  const allAreReady = files.every((file) => file.status === "ready") && files.length > 0;
  return (
    <div className="p-2 bg-transparent">
      <Button
        disabled={files.length === 0}
        
        className={cn("w-full", allAreReady ? "" : "bg-foreground/5")}
        variant={allAreReady ? "onboarding" : "outline"}
        size="lg"
        onClick={compressAll}
      >
        Compress All
      </Button>
    </div>
  );
};
