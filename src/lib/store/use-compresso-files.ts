import { stat } from "@tauri-apps/plugin-fs";
import useCompressoStore, { FileStatus } from "./compresso-store";
import { basename, extname, sep } from "@tauri-apps/api/path";
import { OptimizeConfig, OptimizeProgress } from "../optimizer/types";
import { useFileSelection } from "./store-hooks";
// import { useFileSelection } from "./store-hooks";
// import { debounce } from "lodash";

export interface CompressoFile {
  id: string;
  path: string;
  originalSize: number;
  compressedSize?: number;
  filename: string;
  extension: string;
  folderPath: string;
  progress?: OptimizeProgress;
  addedAt: Date;
  status: FileStatus;
  overrideConfig?: Partial<OptimizeConfig>;
}

export const createCompressoFileFromPath = async (
  path: string
): Promise<CompressoFile> => {
  const metadata = await stat(path);
  const originalSize = metadata.size;

  const filename = await basename(path);
  const extension = await extname(path);
  const folderPath = path.split(sep()).slice(0, -1).join(sep());
  const id = generateId();

  const addedAt = new Date();

  return {
    path,
    originalSize,
    filename,
    extension,
    folderPath,
    id,
    addedAt,
    status: "ready",
  };
};

export const useCompressoFiles = () => {
  const files = useCompressoStore((state) => state.files);
  const setFiles = useCompressoStore((state) => state.setFiles);
  const addFileDirectly = useCompressoStore((state) => state.addFile);
  const {selectFileId} = useFileSelection()

  const addFile = (file: CompressoFile) => {
    addFileDirectly(file);
  };

  const addPaths = async (paths: string[]) => {
    let addedFileIds: string[] = [];
    for (const path of paths) {
      const file = await createCompressoFileFromPath(path);
      addFile(file);
      addedFileIds.push(file.id);
    }
    if (paths.length === 1) {
      selectFileId(addedFileIds[0]);
    }
  };

  const updateFileProgress = (fileId: string, progress: OptimizeProgress) => {
    setFiles(
      files.map((file) => (file.id === fileId ? { ...file, progress } : file))
    );
  };

  const clearFileWithId = (fileId: string) => {
    const nextFiles = files.filter((file) => file.id !== fileId);
    setFiles(nextFiles);
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const setFileStatus = (fileId: string, status: FileStatus) => {
    setFiles(
      files.map((file) => (file.id === fileId ? { ...file, status } : file))
    );
  };

  const setTrims = (fileId: string, trimStart: number, trimEnd: number) => {
    // set the override config for this file
    // override config will be merged with the default config
    // at the time of compression
    setFiles(
      files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              overrideConfig: {
                ...file.overrideConfig,
                trimStart: trimStart === 0 ? undefined : trimStart,
                trimEnd: trimEnd === 1 ? undefined : trimEnd,
              },
            }
          : file
      )
    );
  };

  const compressAll = () => {
    setFiles(files.map((file) => ({ ...file, status: "waiting" })));
  };

  return {
    files,
    setFiles,
    addFile,
    addPaths,
    updateFileProgress,
    clearAllFiles,
    clearFileWithId,
    setFileStatus,
    compressAll,
    setTrims,
  };
};

export const useReoptimize = () => {
  const reCompressFileIds = useCompressoStore(
    (state) => state.reCompressFileIds
  );
  const queueFileForRecompress = useCompressoStore(
    (state) => state.queueFileForRecompress
  );
  const removeFileFromRecompressQueue = useCompressoStore(
    (state) => state.removeFileFromRecompressQueue
  );

  return {
    reCompressFileIds,
    queueFileForRecompress,
    removeFileFromRecompressQueue,
  };
};

export const useIsRunning = () => {
  const isRunning = useCompressoStore((state) => state.isRunning);
  const setIsRunning = useCompressoStore((state) => state.setIsRunning);
  return { isRunning, setIsRunning };
};

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
