import {
  CompressoFile,
  useCompressoFiles,
  useReoptimize,
} from "@/lib/store/use-compresso-files";
import {
  FileItemRoot,
  FileItemName,
  FileItemThumbnail,
  SizeCounterValue,
} from "./file-item-root";
import { useOptimizeImmediately } from "@/lib/optimizer/useOptimizer";
import { useEffect, useMemo } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  ArrowDownIcon,
  ArrowRight,
  ChevronRight,
  FolderIcon,
  StopCircleIcon,
  XIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFileSelection, useOptimizeConfig } from "@/lib/store/store-hooks";

import { FileName } from "./size-counter";
import { useFileItemContextMenu } from "./use-file-item-context-menu";
import { usePostHog } from "posthog-js/react";
import { Button } from "../ui/button";
import { showInFolder } from "@/lib/rust-function-calls";
import { FileBadge, getVariant } from "../file-badge";
import { FileStatus } from "@/lib/store/compresso-store";

export const calculatePctSmaller = (
  originalSize: number,
  compressedSize: number
) => {
  return Math.round(
    ((originalSize - (compressedSize ?? 0)) / originalSize) * 100
  );
};

export const FileItem = ({
  file,
  hasPaid,
  loadingAccess,
}: {
  file: CompressoFile;
  hasPaid: boolean;
  loadingAccess: boolean;
}) => {
  // starts optimizing if not already optimized
  const { optimizeConfig } = useOptimizeConfig();

  const { progress, error, abort, isRetry } = useOptimizeImmediately({
    file,
    config: optimizeConfig,
    hasPaid,
    loadingAccess,
  });
  const { selectedFileIds } = useFileSelection();
  const { updateFileProgress } = useCompressoFiles();

  const abortCompression = () => {
    abort();
    setFileStatus(file.id, "ready");
  };

  const videoUrl = useMemo(() => {
    const url = convertFileSrc(file.path);
    return url;
  }, [file]);

  const { clearFileWithId, setFileStatus } = useCompressoFiles();
  const { queueFileForRecompress } = useReoptimize();
  const postHog = usePostHog();

  const { handleContextMenu } = useFileItemContextMenu({
    abort,
    progress,
    isRunning: !!progress && progress.progress < 1,
    clearFile: () => {
      clearFileWithId(file.id);
    },
    recompress: () => {
      queueFileForRecompress(file.id);
    },
    postHog,
  });

  // get display info
  const filename = file.filename;
  const originalSize = toMB(file.originalSize);
  const compressedSize = progress?.totalSize
    ? toMB(progress.totalSize)
    : undefined;
  const progressValue = (progress?.progress ?? 0) * 100;

  const pctSmaller = calculatePctSmaller(originalSize, compressedSize ?? 0);

  // Update progress in the state file so we can display it in the preview area
  useEffect(() => {
    if (!progress) return;
    updateFileProgress(file.id, progress);
  }, [progress]);

  const fileIsSelected = selectedFileIds.includes(file.id);

  const estimatedCompressedSize = calculateEstimatedCompressedSize(
    compressedSize ?? 0,
    progressValue / 100
  );

  return (
    <FileItemRoot
      onContextMenu={handleContextMenu}
      className={cn(
        "w-full p-2 cursor-default  ",
        !fileIsSelected && "hover:bg-selection/1",
        fileIsSelected && "bg-foreground/5 "
      )}
    >
      <div className="flex gap-2 space-y-0 items-center">
        {/* thumbnail */}
        <FileItemThumbnail
          key={videoUrl}
          className="w-16 h-16
        flex items-center justify-center
         bg-foreground/5 rounded p-1"
        >
          <video
            muted
            className="
        w-full
        rounded
        h-full object-cover"
            src={videoUrl}
          />
        </FileItemThumbnail>

        {/* name and progress bar */}
        <FileItemName className="flex-1 text-sm space-y-2 flex flex-col w-full min-w-5">
          <div className=" truncate flex flex-col">
            <div className="flex flex-col gap-0">
              <FileName name={filename} />
            </div>
          </div>

          {!error && (
            <SizesInfo
              originalSize={originalSize}
              compressedSize={compressedSize}
              progressValue={progressValue}
              estimatedCompressedSize={estimatedCompressedSize}
            />
          )}

          {/* TODO: Show the error in an overlay on a status "Error" */}
          {/* {error && <div className="">{error}</div>} */}
        </FileItemName>
      </div>

      {/* Tools */}
      <div className="text-sm flex  items-center justify-between">
        <div className="text-xs">
          {file.status === "done" ? (
            <FileBadge variant={getVariant("done")}>
              <ArrowDownIcon className="w-3 h-3 inline-block mr-1" />
              {pctSmaller}%
            </FileBadge>
          ) : (
            // <PctSmaller pctSmaller={pctSmaller} isDone={isDone} />
            <FileBadge
              variant={getVariant(file.status)}
              progress={progressValue}
            >
              {file.status === "error"
                ? ""
                : FileBadgeContent({
                    fileStatus: file.status,
                    isRetry: isRetry,
                    progressValue,
                  })}{" "}
              {file.status === "error" && (
                <span className="text-xs opacity-80">{error}</span>
              )}
            </FileBadge>
          )}
        </div>
        <div className=" flex items-center">
          <Button
            title="Show in folder"
            variant="ghost"
            size="sm"
            disabled={file.status !== "done"}
            onClick={(e) => {
              e.stopPropagation();
              if (progress?.finalPath) {
                showInFolder(progress.finalPath, postHog);
              }
            }}
          >
            <FolderIcon className="w-3 h-3 opacity-60" />
          </Button>

          <Button
            title="Remove from list"
            variant="ghost"
            disabled={file.status === "compressing"}
            size="sm"
            onClick={() => clearFileWithId(file.id)}
          >
            <XIcon className="w-3 h-3 opacity-60" />
          </Button>

          {file.status === "compressing" && (
            <Button
              variant="ghost"
              size="sm"
              title="Stop compression"
              onClick={(e) => {
                e.stopPropagation();
                abortCompression();
              }}
            >
              <StopCircleIcon className="w-3 h-3 opacity-60" />
            </Button>
          )}

          {file.status !== "compressing" && file.status !== "waiting" && (
            <>
              <Button
                title="Compress now"
                variant="ghost"
                className="text-xs opacity-60"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileStatus(file.id, "waiting");
                }}
              >
                GO
                <ChevronRight className="w-3 h-3 opacity-60" />
              </Button>
            </>
          )}
        </div>
      </div>
    </FileItemRoot>
  );
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const calculateEstimatedCompressedSize = (
  compressedSize: number,
  progressValue: number
) => {
  const estimate =
    compressedSize && progressValue > 0.05 && progressValue < 0.97
      ? compressedSize * (1 / progressValue)
      : undefined;

  return estimate;
};

const SizesInfo = ({
  originalSize,
  compressedSize,
  className,
  // progressValue,
  estimatedCompressedSize,
}: {
  originalSize: number;
  compressedSize?: number;
  className?: string;
  progressValue: number;
  estimatedCompressedSize?: number;
}) => {
  // const progressFraction = progressValue / 100;
  // const estimatedCompressedSize =
  //   compressedSize && progressFraction > 0.05 && progressFraction < 0.97
  //     ? compressedSize * (1 / progressFraction)
  //     : undefined;
  return (
    <div className={cn("flex font-mono items-center text-sm   ", className)}>
      <>
        <div className="flex items-center gap-[1px]  opacity-60 h-full ">
          <SizeCounterValue slotKey="originalSize" value={originalSize} />

          {compressedSize && (
            <>
              <ArrowRight
                className="w-3 h-3 self-center "
                strokeLinecap="butt"
              />

              <SizeCounterValue
                slotKey="compressedSize"
                value={compressedSize ?? 0}
              />
            </>
          )}

          {estimatedCompressedSize && (
            <div className="flex opacity-50">
              (~
              <SizeCounterValue
                slotKey="compressedSize"
                value={estimatedCompressedSize}
              />
              )
            </div>
          )}
        </div>
      </>
    </div>
  );
};

const toMB = (bytes: number) => {
  return bytes / 1024 / 1024;
};

export const PctSmaller = ({
  pctSmaller,
  isDone,
  className,
}: {
  pctSmaller: number;
  isDone: boolean;
  className?: string;
  postLabel?: string;
}) => {
  let test = false;

  // test = true

  if (test) return null;

  // isDone = false;

  return (
    <motion.div
      className={cn(
        "overflow-hidden",
        // "bg-white/10 rounded-lg text-white/80 ",

        className
      )}
      initial={{ opacity: 0.0, y: "-200%" }}
      animate={{
        opacity: isDone ? 1 : 0.0,
        y: isDone ? 0 : "-200%",
      }}
      transition={{ duration: 0.25 }}
    >
      <FileBadge variant="gray">
        <span>
          <ArrowDownIcon className="w-3 h-3 inline-block mr-1" />
          {pctSmaller}%
        </span>
      </FileBadge>
    </motion.div>
  );
};

const FileBadgeContent = ({
  fileStatus,
  isRetry,
  progressValue,
}: {
  fileStatus: FileStatus;
  isRetry: boolean;
  progressValue?: number;
}) => {
  switch (fileStatus) {
    case "compressing":
      return (
        <>
          {isRetry ? "Retrying" : "Compressing"}{" "}
          {progressValue && (
            <span className="text-xs opacity-80">
              {progressValue.toFixed(0)}%
            </span>
          )}
        </>
      );
    case "ready":
      return "Ready";
    default:
      // Done and error is handled in parent
      // so we don't end up here:
      return capitalize(fileStatus);
  }
};
