import { Command } from "@tauri-apps/plugin-shell";

export const getMediaDuration = async (filePath: string): Promise<number> => {
  const durationCommand = Command.sidecar("binaries/ffmpeg", ["-i", filePath]);
  await durationCommand.spawn();
  return new Promise<number>((resolve, reject) => {
    console.log("get media duration: waiting for data");

    durationCommand.on("error", (error) => {
      console.error("get media duration: error", error);
      reject(error);
    });

    durationCommand.on("close", (e) => {
      console.log("get media duration: close", e);
      if (e.code !== 0) {
        reject(new Error("Can't get duration." + e.code));
      }
    });

    durationCommand.stderr.on("data", (line) => {
      const durationMatch = line.match(
        /Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/
      );
      if (durationMatch) {
        const [, hours, minutes, seconds] = durationMatch;
        const duration =
          parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        resolve(duration);
        return;
      }
    });
  });
};
