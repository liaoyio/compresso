import { showInFolder } from "@/lib/rust-function-calls";
import { useFileSelection } from "@/lib/store/store-hooks";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { PostHog, usePostHog } from "posthog-js/react";
import { useCallback } from "react";

export const useComparisonContextMenu = () => {
  const { selectedFiles } = useFileSelection();
  const selectedFile = selectedFiles[0];
  const outputPath = selectedFile?.progress?.finalPath;
  const postHog = usePostHog();

  const createContextMenu = useCallback(() => {
    return createComparisonContextMenu({ outputPath, postHog });
  }, []);

  return { createContextMenu };
};

const createComparisonContextMenu = async ({
  outputPath,
  postHog,
}: {
  outputPath?: string;
  postHog: PostHog;
}) => {
  const menuItems = await Promise.all([
    MenuItem.new({
      text: "Show in Folder",
      action: () => {
        if (!outputPath) return;
        postHog.capture("show-file-in-folder", {
          location: "comparison-slider-context-menu",
        });
        showInFolder(outputPath, postHog)
          .then(() => {})
          .catch((e) => {
            console.error(e);
            postHog.capture("caught_error", {
              name: "showInFolder",
              error: e,
              path: outputPath,
            });
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
