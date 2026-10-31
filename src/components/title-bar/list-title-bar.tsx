import { PinIcon, PlusIcon, Settings2Icon, TrashIcon } from "lucide-react";
import { TitleBarButton, TitleBarRoot } from "./title-bar";
import { useCompressoFiles } from "@/lib/store/use-compresso-files";
import { selectFiles } from "@/lib/select-files";
import { useSettings } from "@/lib/store/store-hooks";
import { usePostHog } from "posthog-js/react";
import { usePinning } from "@/lib/store/use-pinning";
import { cn } from "@/lib/utils";

import { AnimatePresence } from "framer-motion";

export const ListTitleBar = () => {
  const { addPaths, clearAllFiles, files } = useCompressoFiles();
  const { toggleSettings, settingsIsOpen } = useSettings();
  const posthog = usePostHog();

  const handleAddPaths = async () => {
    const paths = await selectFiles();
    if (!paths) return;
    addPaths(paths);
    posthog.capture("added-files", {
      count: paths.length,
      location: "list-title-bar",
    });
  };

  const { isPinned, togglePin } = usePinning({
    onPin: () => {
      if (settingsIsOpen) {
        toggleSettings();
      }
      posthog.capture("pinned-files", {
        count: files.length,
        location: "list-title-bar",
      });
    },
  });

  return (
    <AnimatePresence>
      <TitleBarRoot>
      {!isPinned && (
          <TitleBarButton onClick={toggleSettings} title="Compression Settings">
            <Settings2Icon className="titlebar-icon" />
          </TitleBarButton>
        )}

        <TitleBarButton title="Add files" onClick={handleAddPaths}>
          <PlusIcon className="titlebar-icon" />
        </TitleBarButton>

        <TitleBarButton
          title="Clear all files"
          onClick={clearAllFiles}
          disabled={files.length === 0}
        >
          <TrashIcon className="titlebar-icon" />
        </TitleBarButton>

        <TitleBarButton
          title="Pin"
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
