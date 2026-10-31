import { CompressoFile } from "@/lib/store/use-compresso-files";
import { useMediaInfo } from "../use-media-info";
import { TableFormats } from "./table-formats";
import { TableStream } from "./table-video-streams";

export const ComparisonTable = ({
  originalCompressoFile,
  compressedPath,  
}: {
  originalCompressoFile: CompressoFile;
  compressedPath?: string;
  sourceSize: number;
  outputSize?: number;
}) => {
  const { mediaInfo: compressedInfo, isLoading: compressedIsLoading } =
    useMediaInfo(compressedPath);

  const { mediaInfo: originalInfo, isLoading: originalIsLoading } =
    useMediaInfo(originalCompressoFile.path);

  if (compressedIsLoading || originalIsLoading) {
    return null;
  }

  const originalFormat = originalInfo?.format;
  const compressedFormat = compressedInfo?.format;


  const originalVideoStreams = originalInfo?.streams?.filter(
    (stream) => stream.codec_type === "video"
  );
  const compressedVideoStreams = compressedInfo?.streams?.filter(
    (stream) => stream.codec_type === "video"
  );

  const compressedAudioStreams = compressedInfo?.streams?.filter(
    (stream) => stream.codec_type === "audio"
  );

  const originalAudioStreams = originalInfo?.streams?.filter(
    (stream) => stream.codec_type === "audio"
  );

  return (
    <div className="grid grid-cols-1 gap-10 mt-5">
      {originalFormat && compressedFormat && (
        <div>
          <TableHeading>Format</TableHeading>
          <TableFormats
            originalFormat={originalFormat}
            compressedFormat={compressedFormat}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        {originalVideoStreams &&
          compressedVideoStreams &&
          originalVideoStreams.length > 0 &&
          compressedVideoStreams.length > 0 && (
            <div>
              <TableHeading>Video Stream</TableHeading>
              <TableStream
                originalStream={originalVideoStreams[0]}
                compressedStream={compressedVideoStreams[0]}
              />
            </div>
          )}

        {originalAudioStreams &&
          compressedAudioStreams &&
          originalAudioStreams.length > 0 &&
          compressedAudioStreams.length > 0 && (
            <div>
              <TableHeading>Audio Stream</TableHeading>
              <TableStream
                originalStream={originalAudioStreams[0]}
                compressedStream={compressedAudioStreams[0]}
              />
            </div>
          )}
      </div>
    </div>
  );
};

const TableHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2 px-4 w-full">
      <h2 className="text-lg w-full border-b-1 border-foreground/50 font-semibold  mt-4">
        {children}
      </h2>
    </div>
  );
};
