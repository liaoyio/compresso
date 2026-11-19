import { showInFolder } from "@/lib/rust-function-calls";
import { useFileSelection } from "@/lib/store/store-hooks";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { useCallback } from "react";

export const useComparisonContextMenu = () => {
  const { selectedFiles } = useFileSelection();
  const selectedFile = selectedFiles[0];
  const outputPath = selectedFile?.progress?.finalPath;

  const createContextMenu = useCallback(() => {
    return createComparisonContextMenu({ outputPath });
  }, []);

  return { createContextMenu };
};

const createComparisonContextMenu = async ({
  outputPath,
}: {
  outputPath?: string;
}) => {
  const menuItems = await Promise.all([
    MenuItem.new({
      text: "在文件夹中显示",
      action: () => {
        if (!outputPath) return;
        showInFolder(outputPath).catch((e) => {
          console.error(e);
        });
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
