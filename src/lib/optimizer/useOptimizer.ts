import { useEffect, useMemo, useRef, useState } from "react";
import { OptimizeConfig, OptimizeProgress } from "./types";
import { optimizeVideo } from "./optimizer";
import {
  CompressoFile,
  useCompressoFiles,
  // useCompressoFiles,
  // useReoptimize,
} from "../store/use-compresso-files";
import useCompressoStore from "../store/compresso-store";
import { optimizeConfigForTargetSize } from "./target-size-utils";

export const useOptimizer = () => {
  const [progress, setProgress] = useState<OptimizeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const [isRetry, setIsRetry] = useState(false);

  const optimize = async (
    file: CompressoFile,
    config: OptimizeConfig,
    isRetry: boolean = false,
    retryCount: number = 0
  ) => {
    try {
      setError(null);
      setIsRetry(isRetry);
      abortController.current = new AbortController();

      // merge the override config with the current config
      const activeConfig = { ...config, ...file.overrideConfig };

      const stats = await optimizeVideo(
        file,
        activeConfig,
        abortController.current.signal,
        (p) => {
          const nextProgress = { ...p };
          setProgress(nextProgress);
        }
      );

      return stats;
    } catch (e) {
      console.error("useOptimizer error", e);

      // Special handling for restart error
      if ((e as Error).message === "RESTART_COMPRESSION") {
        if (retryCount >= 12) {
          const targetSizeMb = config.targetSizeBytes
            ? Math.round((config.targetSizeBytes / 1024 / 1024) * 10) / 10
            : "the requested";
          throw new Error(`无法压到 ${targetSizeMb} MB 以内`);
        }

        // Clear progress and error state
        setProgress(null);
        setError(null);

        const newConfig = optimizeConfigForTargetSize(
          config,
          file.overrideConfig
        );

        return optimize(file, { ...newConfig, overwrite: true }, true, retryCount + 1);
      }

      setError((e as Error).message);
      throw e;
    }
  };

  const abort = () => {
    if (abortController.current) {
      abortController.current.abort();
      setProgress(null);

      setError(new Error("已取消").message);
      abortController.current = null;
    }
  };

  return {
    progress,
    error,
    optimize,
    abort,
    isRetry,
  };
};

// Wrapper of useOptimizer that optimizes immediately
export const useOptimizeImmediately = ({
  file,
  config,
}: {
  file: CompressoFile;
  config: OptimizeConfig;
}) => {
  // const { reCompressFileIds, removeFileFromRecompressQueue } = useReoptimize();
  const { optimize, progress, error, abort, isRetry } = useOptimizer();

  const { files } = useCompressoFiles();
  const [setFileStatus] = useCompressoStore((state) => [state.setFileStatus]);
  const isCompressing = useRef(false);

  const compressing = files.filter((file) => file.status === "compressing");
  const compressingIds = compressing.map((file) => file.id);

  // am i up next?
  useEffect(() => {
    if (compressingIds.includes(file.id) && !isCompressing.current) {
      // setFileStatus(file.id, "compressing");
      isCompressing.current = true;
      optimize(file, config)
        .then(() => {
          setFileStatus(file.id, "done");
          isCompressing.current = false;
        })
        .catch((e) => {
          console.error("useOptimizeImmediately caught error", e);
          setFileStatus(file.id, "error");
          isCompressing.current = false;
        });
      /// compression happens in the file item component via useOptimizeImmediately
    }
  }, [compressingIds]);

  return { progress, error, abort, isRetry };
};

export const useCompressionQueue = () => {
  const [files, setFileStatus] = useCompressoStore((state) => [
    state.files,
    state.setFileStatus,
  ]);

  const waitingFiles = useMemo(() => {
    // TODO: Use idle when we have a button
    return files
      .filter((file) => file.status === "waiting")
      .map((file) => file.id);
  }, [files]);

  const nowCompressing = useMemo(() => {
    return files
      .filter((file) => file.status === "compressing")
      .map((file) => file.id);
  }, [files]);

  // const maxConcurrentCompressions = 1;

  useEffect(() => {
    if (waitingFiles.length > 0 && nowCompressing.length == 0) {
      const fileToCompress = waitingFiles[0];
      setFileStatus(fileToCompress, "compressing");
    }
  }, [waitingFiles, nowCompressing]);

  // return { addFile, files, waitingFiles, nowCompressing };
};
