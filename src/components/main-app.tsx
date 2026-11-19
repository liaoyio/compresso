import {
  createCompressoFileFromPath,
  useCompressoFiles,
} from "@/lib/store/use-compresso-files";
import { DragDropEvent, useDropFiles } from "@/lib/use-drop-files";
import { FileList } from "./file-list/file-list";
import { Separator } from "./ui/separator";
import { ListTitleBar } from "./title-bar/list-title-bar";
import { PreviewTitleBar } from "./title-bar/preview-title-bar";
import { FilePreview } from "./file-preview/file-preview";
import { SettingsSidebar } from "./settings-sidebar/settings-sidebar";
import { useSettings } from "@/lib/store/store-hooks";
import { cn } from "@/lib/utils";
import { usePinning } from "@/lib/store/use-pinning";
import { CompressAll } from "./compress-all";
import { Spacer } from "./spacer";
import { useCompressionQueue } from "@/lib/optimizer/useOptimizer";
import { useOpenedFiles } from "@/lib/use-opened-files";

export const MainApp = () => {
  const { addFile, addPaths, files } = useCompressoFiles();
  const { settingsIsOpen } = useSettings();

  const handlePaths = async (paths: string[]) => {
    console.log("handlePaths", paths);
    for (const path of paths) {
      const compressoFile = await createCompressoFileFromPath(path);
      addFile(compressoFile);
    }
  };

  const onDrop = async (event: DragDropEvent) => {
    // TODO: Actually accept only videos
    const acceptedPaths = event.paths;
    handlePaths(acceptedPaths);
  };
  useOpenedFiles((paths) => {
    addPaths(paths);
  });

  const { isPinned } = usePinning({});
  useDropFiles({ onDrop });
  const hasFiles = files.length > 0;
  useCompressionQueue();

  return (
    <div
      className={cn(
        "flex h-screen max-h-screen overflow-hidden",
        isPinned &&
          "dark:bg-gradient-to-b dark:from-blue-950/20 dark:to-blue-900/30",
        isPinned && "bg-gradient-to-b from-blue-100 to-blue-200"
      )}
    >
      {settingsIsOpen && (
        <div className=" w-[16em] shrink-0 h-full grow-0">
          <SettingsSidebar />
        </div>
      )}

      <div
        data-tauri-drag-region
        className=" w-72 shrink-0 h-full  flex flex-col"
      >
        <ListTitleBar />
        {hasFiles ? <FileList files={files} /> : <EmptyState />}

        <Spacer />
        <CompressAll />
      </div>

      <Separator orientation="vertical" className="p-0" />

      <div className="flex-col flex w-full">
        <PreviewTitleBar />
        <FilePreview />
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center text-center p-10 opacity-50">
      将视频拖到这里，或点击 + 选择文件
    </div>
  );
};
