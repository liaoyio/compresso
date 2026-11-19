import { useEffect, useState } from "react";
import useCompressoStore from "./compresso-store";
import {
  getCurrentWindow,
  PhysicalSize,
  LogicalSize,
} from "@tauri-apps/api/window";

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

  const togglePin = () => {
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
    } else {
      // Changed back to unpinned
      onUnpin?.();
      if (unpinnedSize) {
        WindowHelper.unpinWindow(unpinnedSize);
      }
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
    // NOTE: setMaximizable removed — tao 0.30.2 panics on macOS when the window
    // has no standard zoom button (decorations: false). setResizable(false)
    // already disables zoom, so behavior is unchanged.
  },
  unpinWindow: async (restoreSize: PhysicalSize) => {
    const w = getCurrentWindow();
    await w.setAlwaysOnTop(false);
    await w.setSize(restoreSize);
    await w.setMaxSize(undefined);
    await w.setResizable(true);
  },
};
