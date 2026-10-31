import { Command } from "@tauri-apps/plugin-shell";
import { Ffprobe } from "./probe-type";

// // ffprobe -v quiet -print_format json -show_format -show_streams "lolwut.mp4"
// return as Ffprobe type

export const getMediaInfo = async (filePath: string) => {
  const command = Command.sidecar("binaries/ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    filePath,
  ]);

  const output = await command.execute();

  if (output.code !== 0) {
    throw new Error(
      `ffp failed with code ${output.code}: ${output.stderr}`
    );
  }

  const info: Ffprobe = JSON.parse(output.stdout);

  // frame rate is in the format "30/1"
  const [frameRate, fraction] =
    info.streams
      ?.find((stream) => stream.codec_type === "video")
      ?.r_frame_rate.split("/") ?? [];
  const videoFps = frameRate ? Number(frameRate) / Number(fraction) : null;

  const summary = {
    duration: info.format?.duration,
    fileExtension: filePath.split(".").pop(),
    videoCodec: info.streams?.find((stream) => stream.codec_type === "video")
      ?.codec_name,
    size: info.format?.size,
    videoFps,
    hasAudio: info.streams?.find((stream) => stream.codec_type === "audio")
      ? true
      : false,
    hasVideo: info.streams?.find((stream) => stream.codec_type === "video")
      ? true
      : false,
    audioCodec: info.streams?.find((stream) => stream.codec_type === "audio")
      ?.codec_name,
    audioSampleRate: info.streams?.find(
      (stream) => stream.codec_type === "audio"
    )?.sample_rate,
    videoWidth: info.streams?.find((stream) => stream.codec_type === "video")
      ?.width,
    videoHeight: info.streams?.find((stream) => stream.codec_type === "video")
      ?.height,
  };

  return { ...info, summary };
};

export type FFSummary = {
  duration?: number;
  fileExtension?: string;
  videoCodec?: string;
  size?: number;
  videoFps?: number | null;
  hasAudio?: boolean;
  hasVideo?: boolean;
  audioCodec?: string;
  audioSampleRate?: number;
  videoWidth?: number;
  videoHeight?: number;
};
