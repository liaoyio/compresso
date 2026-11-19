import { PinIcon, PlusIcon, Settings2Icon, TrashIcon } from "lucide-react";
import { TitleBarButton, TitleBarRoot } from "./title-bar";
import { useCompressoFiles } from "@/lib/store/use-compresso-files";
import { selectFiles } from "@/lib/select-files";
import { useSettings } from "@/lib/store/store-hooks";
import { usePinning } from "@/lib/store/use-pinning";
import { cn } from "@/lib/utils";

import { AnimatePresence } from "framer-motion";

export const ListTitleBar = () => {
  const { addPaths, clearAllFiles, files } = useCompressoFiles();
  const { toggleSettings, settingsIsOpen } = useSettings();

  const handleAddPaths = async () => {
    const paths = await selectFiles();
    if (!paths) return;
    addPaths(paths);
  };

  const { isPinned, togglePin } = usePinning({
    onPin: () => {
      if (settingsIsOpen) {
        toggleSettings();
      }
    },
  });

  return (
    <AnimatePresence>
      <TitleBarRoot>
      {!isPinned && (
          <TitleBarButton onClick={toggleSettings} title="压缩设置">
            <Settings2Icon className="titlebar-icon" />
          </TitleBarButton>
        )}

        <TitleBarButton title="添加文件" onClick={handleAddPaths}>
          <PlusIcon className="titlebar-icon" />
        </TitleBarButton>

        <TitleBarButton
          title="清空列表"
          onClick={clearAllFiles}
          disabled={files.length === 0}
        >
          <TrashIcon className="titlebar-icon" />
        </TitleBarButton>

        <TitleBarButton
          title="迷你模式（置顶）"
          className={cn(
            isPinned && "bg-lime-500/20 text-lime-700 dark:text-lime-500"
          )}
          onClick={togglePin}
        >
          {isPinned ? (
            <PinIcon className="titlebar-icon fill-current" />
          ) : (
            <PinIcon className="titlebar-icon" />
          )}
        </TitleBarButton>

        
      </TitleBarRoot>
    </AnimatePresence>
  );
};
