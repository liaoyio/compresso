import { tempDir } from "@tauri-apps/api/path";
import { writeFile } from "@tauri-apps/plugin-fs";
import { getMediaInfo } from "./probe/get-media-info";

const WatermarkConfig = {
  heightFraction: 0.175,
};

export const createWatermarkPath = async ({ path }: { path: string }) => {
  // get video width for watermark
  const { summary } = await getMediaInfo(path);
  const videoHeight = summary.videoHeight;
  if (!videoHeight) {
    throw new Error("Unknown video height");
  }

  const watemarkHeight = videoHeight * WatermarkConfig.heightFraction;

  const blob = await generateWatermark({ height: watemarkHeight });
  const filePath = await saveWatermark(blob);
  return filePath;
};

// helpers

/*
Returns an image blob of the watermark canvas
 */
export const generateWatermark = async ({
  height,
  topLine = "Made smaller for free with",
  bottomLine = "compresso.app",
}: {
  height: number;
  topLine?: string;
  bottomLine?: string;
}) => {
  const width = height * 3;
  const bigFontSize = width * 0.105;
  const smallFontSize = width * 0.07;
  const padding = width * 0.05;
  const strokeWidth = width * 0.013;
  const cornerRadius = width * 0.05;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No context");

  // Set background
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();
  ctx.roundRect(
    strokeWidth / 2,
    strokeWidth / 2,
    width - strokeWidth,
    height - strokeWidth,
    cornerRadius
  );
  ctx.fill();
  ctx.stroke();

  // Set text styles
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(0,0,0,0.9)";

  // Draw first line of text
  ctx.font = `${smallFontSize}px Arial`;
  ctx.fillText(topLine, padding, height * 0.4);

  // Draw second line of text
  ctx.font = `bold ${bigFontSize}px Arial `;
  ctx.fillText(bottomLine, padding, height * 0.75);

  const blob = await canvas.convertToBlob();
  return blob;
};

/*
Saves the watermark to the user's disk using Tauri's API
*/
export const saveWatermark = async (blob: Blob) => {
  try {
    const folder = await tempDir();

    // unique so you can't mess around with the file as easily
    const filename = `watermark_${Date.now()}.png`;
    const filePath = `${folder}/${filename}`;

    const arrayBuffer = await blob.arrayBuffer();
    await writeFile(filePath, new Uint8Array(arrayBuffer));

    return filePath;
  } catch (error) {
    throw error;
  }
};
