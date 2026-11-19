import { FolderIcon, Loader } from "lucide-react";
import { TitleBarButton, TitleBarRoot } from "./title-bar";

import { useFileSelection } from "@/lib/store/store-hooks";
import { cn } from "@/lib/utils";
import { showInFolder } from "@/lib/rust-function-calls";
import { UserButton } from "../file-preview/user-button";
import { useCompressoFiles } from "@/lib/store/use-compresso-files";
import { Spacer } from "../spacer";

export const PreviewTitleBar = () => {
  const { selectedFiles } = useFileSelection();
  const { files } = useCompressoFiles();
  const hasCompressing = files.some((file) => file.status === "compressing");

  const selectedFile = selectedFiles[0];
  const outputPath = selectedFile?.progress?.finalPath;

  const handleShowFileInFolder = async () => {
    if (!outputPath) return;
    await showInFolder(outputPath);
  };

  return (
    <TitleBarRoot>
      {hasCompressing && <Loader className="w-4 h-4 animate-spin" />}
      <Spacer />
      <TitleBarButton
        onClick={handleShowFileInFolder}
        className={cn(
          "disabled:opacity-30 flex items-center gap-2"
          // !selectedFile && "hidden"
        )}
        disabled={!outputPath}
      >
        <FolderIcon className="titlebar-icon" />
        {/* <div>Show</div> */}
      </TitleBarButton>

      <TitleBarButton>
        <UserButton />
      </TitleBarButton>
    </TitleBarRoot>
  );
};
