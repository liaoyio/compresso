import { useEffect, useMemo, useRef, useState } from "react";
import { OptimizeConfig, OptimizeProgress } from "./types";
import { OptimizeStats, optimizeVideo } from "./optimizer";
import {
  CompressoFile,
  useCompressoFiles,
  // useCompressoFiles,
  // useReoptimize,
} from "../store/use-compresso-files";
import { usePostHog } from "posthog-js/react";
import { createSupabaseClient } from "../auth/create-supabase-client";
import useCompressoStore from "../store/compresso-store";
import { optimizeConfigForTargetSize } from "./target-size-utils";

const supabase = createSupabaseClient();

const saveOptimizeStats = (stats: OptimizeStats) => {
  // convert all keys to snake_case
  const pg_stats = Object.entries(stats).reduce((acc, [key, value]) => {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    acc[snakeKey] = value;
    return acc;
  }, {} as Record<string, any>);

  supabase
    .from("compressions")
    .insert(pg_stats)
    .then((result) => {
      if (result.error) console.warn(result.error);
    });
};

export const useOptimizer = ({
  hasPaid,
}: // loadingAccess,
{
  hasPaid: boolean;
  loadingAccess: boolean;
}) => {
  const [progress, setProgress] = useState<OptimizeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const posthog = usePostHog();
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
        hasPaid,
        (p) => {
          const nextProgress = { ...p };
          setProgress(nextProgress);
        }
      );

      posthog.capture("compression_done", stats);
      saveOptimizeStats(stats);
      return stats;
    } catch (e) {
      console.error("useOptimizer error", e);

      // Special handling for restart error
      if ((e as Error).message === "RESTART_COMPRESSION") {
        if (retryCount >= 12) {
          const targetSizeMb = config.targetSizeBytes
            ? Math.round((config.targetSizeBytes / 1024 / 1024) * 10) / 10
            : "the requested";
          throw new Error(`Couldn't fit under ${targetSizeMb} MB`);
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

      setError(new Error("Canceled").message);
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
  hasPaid,
  loadingAccess,
}: {
  file: CompressoFile;
  config: OptimizeConfig;
  hasPaid: boolean;
  loadingAccess: boolean;
}) => {
  // const { reCompressFileIds, removeFileFromRecompressQueue } = useReoptimize();
  const { optimize, progress, error, abort, isRetry } = useOptimizer({
    hasPaid,
    loadingAccess,
  });

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
