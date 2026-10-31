import React from "react";

// Usage example:
// <FileItem>
//   <FileItemThumbnail />
//   <FileItemName>My awesome movies.mp4</FileItemName>
//   <Spacer />
//   <FileItemSizeCounters>
//     <SizeCounter>
//       <SizeCounterLabel>Original</SizeCounterLabel>
//       <SizeCounterValue value={32.1} />
//     </SizeCounter>
//     <SizeCounter>
//       <SizeCounterLabel>Compressed</SizeCounterLabel>
//       <SizeCounterValue value={3.1} />
//     </SizeCounter>
//   </FileItemSizeCounters>
// </FileItem>

import {
  SizeCounter,
  SizeCounterValue,
  SizeCounterLabel,
} from "./size-counter";
import { cn } from "@/lib/utils";

const FileItemRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col  w-full gap-2 ${className}`}
    {...props}
  />
));
FileItemRoot.displayName = "FileItem";

const FileItemThumbnail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
FileItemThumbnail.displayName = "FileItemThumbnail";

const FileItemName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
FileItemName.displayName = "FileItemName";

const FileItemSizeCounters = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex gap-1 ${className}`} {...props} />
));
FileItemSizeCounters.displayName = "FileItemSizeCounters";

export {
  FileItemRoot,
  FileItemThumbnail,
  FileItemName,
  FileItemSizeCounters,
  SizeCounter,
  SizeCounterValue,
  SizeCounterLabel,
};
