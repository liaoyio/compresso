import { OptimizeProgress } from "@/lib/optimizer/types";
import { showInFolder } from "@/lib/rust-function-calls";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { PostHog } from "posthog-js";

export type FileItemContextMenuProps = {
  abort: () => void;
  isRunning: boolean;
  progress?: OptimizeProgress | null;
  clearFile: () => void;
  recompress: () => void;
  postHog: PostHog;
};

export const useFileItemContextMenu = (props: FileItemContextMenuProps) => {
  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fileItemContextMenu(props);
  };

  return { handleContextMenu };
};

const createSeparator = () => {
  return PredefinedMenuItem.new({ item: "Separator" });
};

export const fileItemContextMenu = async ({
  abort,
  isRunning,
  progress,
  clearFile,
  recompress,
  postHog,
}: FileItemContextMenuProps) => {
  const menuItems = await Promise.all([
    MenuItem.new({
      text: "Show in Folder",
      enabled: !!progress?.finalPath,
      action: async () => {
        if (progress?.finalPath) {
          await showInFolder(progress.finalPath, postHog);
        }
      },
    }),

    MenuItem.new({
      text: "Recompress with Current Settings",
      enabled: !!progress?.finalPath,
      action: async () => {
        recompress();
      },
    }),

    MenuItem.new({
      text: "Cancel Compression",
      enabled: isRunning,
      action: async () => {
        abort();
      },
    }),

    createSeparator(),
    MenuItem.new({
      text: "Remove from List",
      action: () => {
        if (isRunning) {
          abort();
        }
        clearFile();
      },
    }),
  ]);

  const menu = await Menu.new({
    items: menuItems,
  });

  await menu.popup().catch((e) => {
    console.error(e);
  });
};
