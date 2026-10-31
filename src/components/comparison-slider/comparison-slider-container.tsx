import { cn } from "@/lib/utils";

export const VideoPreviewContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex mt-0 w-full", className)}>{children}</div>;
};
