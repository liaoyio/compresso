import { cn } from "@/lib/utils";
import { ArrowUpFromLine } from "lucide-react";
import { Button } from "./ui/button";

export const Uploader = ({
  getRootProps,
  getInputProps,
  isDragActive,

  children,
}: {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;

  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-3xl  p-10 flex items-center justify-center">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-5">
          <ArrowUpFromLine
            className={cn(
              //   "w-10 h-10 transition ease-in-out translate-y-5",
              "w-7 h-7 opacity-50",
              "transition ease-in-out duration-300 ",
              isDragActive && "translate-y-3 scale-90"
            )}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {children}
          </div>
          <Button className=" cursor-pointer">Select Files</Button>
        </div>
      </div>
    </div>
  );
};

export const UploaderTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="opacity-80">{children}</div>;
};

export const UploaderSubtitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="text-sm text-muted-foreground max-w-[300px] text-center">
      {children}
    </div>
  );
};
