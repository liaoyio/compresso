import { videoExtensions } from "@/lib/video-extensions";
import { open } from "@tauri-apps/plugin-dialog";

export const selectFiles = async () => {
  const files = await open({
    multiple: true,
    filters: [
      {
        name: "Videos",
        extensions: videoExtensions,
      },
    ],
  });
  const paths = files?.map((file) => file.path);
  return paths;
};
