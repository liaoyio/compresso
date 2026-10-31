import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";

export type Position = { x: number; y: number };

export type DragEnterEvent = {
  paths: string[];
  position: Position;
};

export type DragOverEvent = {
  position: Position;
};

export type DragLeaveEvent = {
  position: Position;
};

export type DragDropEvent = DragEnterEvent;

type UseDropFilesProps = {
  onDrop?: (event: DragDropEvent) => void;
  onDragEnter?: (event: DragEnterEvent) => void;
  onDragLeave?: (event: DragLeaveEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

// ---
// TODO: Unregister listeners on unmount

export const useDropFiles = ({
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
}: UseDropFilesProps) => {
  // const unlistenRef = useRef<UnlistenFn[]>([]);
  const installedRef = useRef(false);

  useEffect(() => {
    const go = async () => {
      if (installedRef.current) return;
      installedRef.current = true;

      await listen("tauri://drag-drop", (event) => {
        const dragEvent = event.payload as DragDropEvent;
        onDrop && onDrop(dragEvent);
      });

      await listen("tauri://drag-enter", (event) => {
        const dragEvent = event.payload as DragEnterEvent;
        onDragEnter && onDragEnter(dragEvent);
      });

      await listen("tauri://drag-leave", (event) => {
        const dragEvent = event.payload as DragLeaveEvent;
        onDragLeave && onDragLeave(dragEvent);
      });

      await listen("tauri://drag-over", (event) => {
        const dragEvent = event.payload as DragOverEvent;
        onDragOver && onDragOver(dragEvent);
      });

      // unlistenRef.current.push(unlisten);
    };

    go();

    // return () => unlistenRef.current.forEach((unlisten) => unlisten());
  }, []);
};
