import { useFileSelection } from "@/lib/store/store-hooks";
import { VideoPreviewContainer } from "../comparison-slider/comparison-slider-container";
import { ComparisonSlider } from "../comparison-slider/comparison-slider";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useMemo, useState } from "react";
import { expandScope } from "@/lib/expand-scope";
import { EmptyPreview } from "./empty-preview";
import { ComparisonTable } from "./table/comparison-table";
import { Button } from "../ui/button";
import { FolderIcon, InfoIcon } from "lucide-react";
import { useMediaInfo } from "./use-media-info";
import {
  PreviewBytes,
  PreviewDataContainer,
  PreviewDataItem,
  PreviewDataSummary,
  PreviewPctSmaller,
  PreviewProgress,
  PreviewTopTitle,
} from "./preview-data/preview-data";
import { calculatePctSmaller } from "../file-list/file-item";
import { cn } from "@/lib/utils";
import { showInFolder } from "@/lib/rust-function-calls";
import { PreFlight } from "./pre-flight/pre-flight";

export const FilePreview = () => {
  const { selectedFiles } = useFileSelection();
  const [showTable, setShowTable] = useState(false);

  const file = selectedFiles[0];
  const finalPath = file?.progress?.finalPath;

  const sourceUrl = useMemo(() => {
    if (!file) return null;
    expandScope(file.path);
    return convertFileSrc(file.path);
  }, [file]);

  const outputUrl = useMemo(() => {
    if (!finalPath) return null;
    expandScope(finalPath);
    return convertFileSrc(finalPath);
  }, [finalPath]);

  const { mediaInfo: compressedInfo } = useMediaInfo(finalPath);
  const { mediaInfo: originalInfo } = useMediaInfo(file?.path);

  if (selectedFiles.length === 0) {
    return <EmptyPreview />;
  }

  if (file.status === "ready" && sourceUrl) {
    return <PreFlight key={sourceUrl} file={file} assetUrl={sourceUrl} />;
  }

  const progress = file.progress?.progress;
  const sourceSize = file.originalSize;
  const outputSize = file.progress?.totalSize;
  const pctSmaller = calculatePctSmaller(sourceSize, outputSize ?? 0) * 0.01;
  const isDone = file.progress?.progress === 1;

  const handleShowInFolder = async () => {
    if (!finalPath) return;
    await showInFolder(finalPath);
  };

  // if the file was trimmed, we don't want to play the source video
  // if the trimStart and end are 0,1 then the video was not trimmed
  const { trimStart, trimEnd } = file.overrideConfig ?? {};
  let wasTrimmed = !!trimStart && !!trimEnd;
  // TODO: This doesn't work.
  

  return (
    <div className="overflow-y-scroll">
      <VideoPreviewContainer>
        <ComparisonSlider
          key={outputUrl}
          sourceUrl={sourceUrl}
          outputUrl={outputUrl}
          wasTrimmed={wasTrimmed}
          progress={progress}
          sourceSize={sourceSize}
          outputSize={outputSize}
        />
      </VideoPreviewContainer>

      {/* Preview data */}

      <PreviewDataContainer>
        <PreviewDataItem className=" w-1/2">
          <PreviewTopTitle>原视频</PreviewTopTitle>
          <PreviewBytes bytes={sourceSize} />

          {originalInfo && (
            <PreviewDataSummary summary={originalInfo.summary} />
          )}
        </PreviewDataItem>

        <PreviewDataItem className="w-1/2">
          <PreviewTopTitle>压缩后</PreviewTopTitle>
          <div className="flex items-center flex-wrap gap-2 ">
            <PreviewBytes bytes={outputSize ?? 0} />
            <PreviewPctSmaller pctSmaller={pctSmaller} isDone={isDone} />
          </div>

          {compressedInfo && (
            <PreviewDataSummary summary={compressedInfo.summary} />
          )}

          {file.progress !== null &&
            file.progress?.speed !== null &&
            !isDone && (
              <>
                <PreviewProgress speed={file.progress?.speed ?? 0} />
              </>
            )}
        </PreviewDataItem>
      </PreviewDataContainer>

      {/* Table */}

      <div className="flex space-x-3 justify-start px-4">
        <ActionButton onClick={() => setShowTable(!showTable)}>
          <InfoIcon className="w-4 h-4" />
          <div className="text-sm">{showTable ? "隐藏" : "显示"}详情</div>
        </ActionButton>
        <ActionButton onClick={handleShowInFolder}>
          <FolderIcon className="w-4 h-4" />
          <div className="text-sm">在文件夹中显示</div>
        </ActionButton>
      </div>

      {showTable && (
        <ComparisonTable
          originalCompressoFile={file}
          compressedPath={finalPath}
          sourceSize={sourceSize}
          outputSize={outputSize}
        />
      )}
    </div>
  );
};

const ActionButton = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      variant={"outline"}
      className={cn("flex items-center gap-2", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
