import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";

type OnOpenedFiles = (paths: string[]) => void;

export const useOpenedFiles = (onOpenedFiles: OnOpenedFiles) => {
  const onOpenedFilesRef = useRef(onOpenedFiles);

  useEffect(() => {
    onOpenedFilesRef.current = onOpenedFiles;
  }, [onOpenedFiles]);

  useEffect(() => {
    let isCancelled = false;
    let unlisten: UnlistenFn | undefined;

    const handlePaths = (paths: string[]) => {
      if (paths.length === 0) return;
      onOpenedFilesRef.current(paths);
    };

    const listenForOpenedFiles = async () => {
      const unlistenFn = await listen<string[]>("opened-files", (event) => {
        handlePaths(event.payload);
      });

      if (isCancelled) {
        unlistenFn();
        return;
      }

      unlisten = unlistenFn;

      const pendingPaths = await invoke<string[]>("take_opened_files");
      if (!isCancelled) {
        handlePaths(pendingPaths);
      }
    };

    listenForOpenedFiles();

    return () => {
      isCancelled = true;
      unlisten?.();
    };
  }, []);
};
