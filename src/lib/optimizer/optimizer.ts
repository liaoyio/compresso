import { Command } from "@tauri-apps/plugin-shell";
import { defaultConfig, OptimizeConfig, OptimizeProgress } from "./types";
import { getMediaDuration } from "./get-media-duration";
import { createFFmpegCommand } from "./create-ffmpeg-command";
import { parseFFmpegStatusLine } from "./parse-ffmpeg-status-line";
import { CompressoFile } from "../store/use-compresso-files";
import { invoke } from "@tauri-apps/api/core";
import { createWatermarkPath } from "../create-watermark";
import { sep } from "@tauri-apps/api/path";
import { TargetEstimator } from "./target-size-utils";
import { getMediaInfo } from "../probe/get-media-info";
import { stat } from "@tauri-apps/plugin-fs";

export type OptimizeStats = {
  originalSize: number;
  optimizedSize: number;
  pctSmaller: number;
  timesSmaller: number;
  bytesSaved: number;
  lastKnownSpeed: number;
  watermarked: boolean;
};

//
export const optimizeVideo = async (
  compressoFile: CompressoFile,
  _config: OptimizeConfig,
  signal: AbortSignal,
  hasPaid: boolean,
  onProgress: (progress: OptimizeProgress) => void
): Promise<OptimizeStats> => {
  // merge config with default config
  // Note: The file's override config is already merged in useOptimizer.ts
  const config = { ...defaultConfig, ..._config };

  const inputFilePath = compressoFile.path;
  const inputFileName = compressoFile.filename;
  const inputFolder = compressoFile.folderPath;
  const inputFileNameWithoutExtension = inputFileName.slice(
    0,
    inputFileName.lastIndexOf(".")
  );

  // get write access to the folder so we can put the output file there
  invoke("expand_scope", { folderPath: inputFolder });
  const outputFilename = `${inputFileNameWithoutExtension}${config.overwrite_postfix}.${config.formats[0]}`;
  const outputPath = compressoFile.folderPath + sep() + outputFilename;

  console.log("get media duration");
  const totalDuration = await getMediaDuration(inputFilePath);
  const sourceHasAudio =
    config.useTargetSize && config.targetSizeBytes
      ? await getMediaInfo(inputFilePath)
          .then((info) => info.summary.hasAudio)
          .catch(() => undefined)
      : undefined;

  // watermark
  const watermarkPath = hasPaid
    ? null
    : await createWatermarkPath({
        path: inputFilePath,
      });

  const ffmpegArgs = createFFmpegCommand({
    inputFilePath: inputFilePath,
    outputPath,
    config,
    watermarkPath,
    mediaDurationSeconds: totalDuration,
    sourceHasAudio,
  });

  const command = Command.sidecar("binaries/ffmpeg", ffmpegArgs);

  if (!command) {
    throw new Error("Can't start (10)");
  }

  // listen to events
  // ----------------

  return new Promise((resolve, reject) => {
    // on close
    // ---------
    let commandHandler: any;
    let pendingRestart = false;

    command.on("close", async (data) => {
      if (pendingRestart) return;

      if (data.code !== 0) {
        return reject(
          new Error(
            "Canceled"
            // `FFmpeg command failed for file ${inputFileName}, code ${data.code}, signal ${data.signal}`
          )
        );
        // throw new Error(
        //   `FFmpeg command failed for file ${inputFileName}, data code ${data.code}, signal ${data.signal}`
        // );
      }

      const finalSize = await stat(outputPath)
        .then((metadata) => metadata.size)
        .catch(() => lastProgress.totalSize);

      if (maxSizeBytes && config.useTargetSize && finalSize > maxSizeBytes) {
        console.log("RETRY: final size exceeded target", {
          finalSize,
          maxSizeBytes,
        });
        return reject(new Error("RESTART_COMPRESSION"));
      }

      onProgress({
        ...lastProgress,
        totalSize: finalSize,
        finalPath: outputPath,
        progress: 1,
      });

      const stats: OptimizeStats = {
        originalSize: compressoFile.originalSize,
        optimizedSize: finalSize,
        pctSmaller: (1 - finalSize / compressoFile.originalSize) * 100,
        timesSmaller: compressoFile.originalSize / finalSize,
        bytesSaved: compressoFile.originalSize - finalSize,
        lastKnownSpeed: lastProgress.speed,
        watermarked: !!watermarkPath,
      };

      resolve(stats);
    }); // on close

    // on error
    // ---------

    command.on("error", (e) => {
      console.error("error", e);
      reject(new Error("Can't compress (11)" + e));
    });

    let lastProgress: OptimizeProgress = {
      progress: 0,
      message: "",
      dupFrames: 0,
      speed: 0,
      fps: 0,
      totalSize: 0,
    };

    // set up target size estimator
    // will throw a specific error if the target size is exceeded
    // so the caller can restart compression with an amended config
    let targetSizer: TargetEstimator | undefined;
    let maxSizeBytes = config.targetSizeBytes;
    if (maxSizeBytes && config.useTargetSize) {
      targetSizer = new TargetEstimator({ maxSizeBytes });
    }

    // on progress
    // ------------
    command.stdout.on("data", (line) => {
      const updatedProgresss = parseFFmpegStatusLine(
        line,
        lastProgress,
        totalDuration
      );
      lastProgress = updatedProgresss;
      onProgress(lastProgress);

      targetSizer?.addSample(lastProgress.totalSize, lastProgress.progress);

      if (targetSizer?.isTargetSizeExceeded()) {
        if (commandHandler) {
          pendingRestart = true;
          commandHandler.kill().then(() => {
            console.log("RETRY: killed ffmpeg");
            console.log("RETRY: restarting compression throwing");
            reject(new Error("RESTART_COMPRESSION"));
          });
        }
      }
    });

    command.spawn().then((handler) => {
      commandHandler = handler;
      signal.addEventListener("abort", () => {
        handler.kill();
      });
    });
  });
};
