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
import { UpdateChecker } from "./update-checker";
import { usePostHog } from "posthog-js/react";
import { useAuth } from "./auth/use-auth";
import { useAccess } from "./auth/use-access";
import { SignInPage } from "./auth/sign-in-page";
import { cn } from "@/lib/utils";
import { usePinning } from "@/lib/store/use-pinning";
import { CompressAll } from "./compress-all";
import { Spacer } from "./spacer";
import { useCompressionQueue } from "@/lib/optimizer/useOptimizer";
import { useOpenedFiles } from "@/lib/use-opened-files";

export const MainApp = () => {
  const { addFile, addPaths, files } = useCompressoFiles();
  const { settingsIsOpen } = useSettings();
  const posthog = usePostHog();
  const { isLoadingOrLoggedIn } = useAuth();

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
    posthog.capture("added-files", {
      count: acceptedPaths.length,
      location: "drop",
    });
  };
  useOpenedFiles((paths) => {
    addPaths(paths);
    posthog.capture("added-files", {
      count: paths.length,
      location: "open-with",
    });
  });

  const { isPinned } = usePinning({});
  useDropFiles({ onDrop });
  const hasFiles = files.length > 0;
  const { hasPaid, loadingAccess } = useAccess();
  useCompressionQueue();

  if (!isLoadingOrLoggedIn) {
    return <SignInPage />;
  }

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
        {hasFiles ? (
          <FileList
            files={files}
            hasPaid={hasPaid}
            loadingAccess={loadingAccess}
          />
        ) : (
          <EmptyState />
        )}

        <Spacer />
        <CompressAll />
      </div>

      <Separator orientation="vertical" className="p-0" />

      <div className="flex-col flex w-full">
        <PreviewTitleBar />
        <FilePreview />
      </div>
      <UpdateChecker />
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center text-center p-10 opacity-50">
      Drag files here or click + to select videos
    </div>
  );
};
