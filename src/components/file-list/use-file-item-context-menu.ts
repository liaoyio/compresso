import { OptimizeProgress } from "@/lib/optimizer/types";
import { showInFolder } from "@/lib/rust-function-calls";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

export type FileItemContextMenuProps = {
  abort: () => void;
  isRunning: boolean;
  progress?: OptimizeProgress | null;
  clearFile: () => void;
  recompress: () => void;
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
}: FileItemContextMenuProps) => {
  const menuItems = await Promise.all([
    MenuItem.new({
      text: "在文件夹中显示",
      enabled: !!progress?.finalPath,
      action: async () => {
        if (progress?.finalPath) {
          await showInFolder(progress.finalPath);
        }
      },
    }),

    MenuItem.new({
      text: "用当前设置重新压缩",
      enabled: !!progress?.finalPath,
      action: async () => {
        recompress();
      },
    }),

    MenuItem.new({
      text: "取消压缩",
      enabled: isRunning,
      action: async () => {
        abort();
      },
    }),

    createSeparator(),
    MenuItem.new({
      text: "从列表中移除",
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
