import { useEffect, useState } from "react";
import useCompressoStore from "./compresso-store";
import {
  getCurrentWindow,
  PhysicalSize,
  LogicalSize,
} from "@tauri-apps/api/window";
import { usePostHog } from "posthog-js/react";

const PinnedSize = new LogicalSize(270, 200);

export const usePinning = ({
  onPin,
  onUnpin,
}: {
  onPin?: () => void;
  onUnpin?: () => void;
}) => {
  const { isPinned, setIsPinned } = useCompressoStore((state) => ({
    isPinned: state.isPinned,
    setIsPinned: state.setIsPinned,
  }));
  const [unpinnedSize, setUnpinnedSize] = useState<PhysicalSize | null>(null);
  const postHog = usePostHog();

  const togglePin = () => {
    postHog.capture("toggle-pin", {
      isPinned: !isPinned,
    });
    setIsPinned(!isPinned);
  };

  useEffect(() => {
    const w = getCurrentWindow();
    // Changed to pinned
    if (isPinned) {
      onPin?.();
      w.innerSize().then((size) => {
        setUnpinnedSize(size);
        WindowHelper.pinWindow();
      });
      postHog.register({ isPinned: true });
    } else {
      // Changed back to unpinned
      onUnpin?.();
      if (unpinnedSize) {
        WindowHelper.unpinWindow(unpinnedSize);
      }
      postHog.register({ isPinned: false });
    }
  }, [isPinned]);

  return { isPinned, togglePin };
};

const WindowHelper = {
  pinWindow: async () => {
    const w = getCurrentWindow();
    await w.setAlwaysOnTop(true);
    await w.setSize(PinnedSize);
    await w.setResizable(false);
    await w.setMaximizable(false);
  },
  unpinWindow: async (restoreSize: PhysicalSize) => {
    const w = getCurrentWindow();
    await w.setAlwaysOnTop(false);
    await w.setSize(restoreSize);
    await w.setMaxSize(undefined);
    await w.setMaximizable(true);
    await w.setResizable(true);
  },
};
