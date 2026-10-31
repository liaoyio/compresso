import { FolderIcon, Loader, Loader2, ZapIcon } from "lucide-react";
import { TitleBarButton, TitleBarRoot } from "./title-bar";

import { useFileSelection } from "@/lib/store/store-hooks";
import { cn } from "@/lib/utils";
import { showInFolder } from "@/lib/rust-function-calls";
import { usePostHog } from "posthog-js/react";
import { useAuth } from "../auth/use-auth";
import { useAccess } from "../auth/use-access";
import { UserButton } from "../file-preview/user-button";
import { useCompressoFiles } from "@/lib/store/use-compresso-files";
import { Spacer } from "../spacer";

export const PreviewTitleBar = () => {
  const { selectedFiles } = useFileSelection();
  const posthog = usePostHog();
  const { files } = useCompressoFiles();
  const hasCompressing = files.some((file) => file.status === "compressing");

  const selectedFile = selectedFiles[0];
  const outputPath = selectedFile?.progress?.finalPath;

  const handleShowFileInFolder = async () => {
    if (!outputPath) return;
    await showInFolder(outputPath, posthog);
    posthog.capture("show-file-in-folder", { location: "title-bar" });
  };

  const { hasPaid, loadingAccess } = useAccess();
  // const { email, userId } = useAuth();
  const { watermarkLink } = useRemoveWatermarkLink("tb");
  const watermarkLinkLoading = false;

  const handleRemoveWatermark = () => {
    posthog.capture("remove-watermark-clicked");
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

      {!hasPaid && !loadingAccess && (
        <a
          target="_blank"
          href={watermarkLink!}
          className={cn(
            watermarkLinkLoading ? "pointer-events-none" : "",
            watermarkLinkLoading && "opacity-80"
          )}
        >
          <TitleBarButton
            onClick={handleRemoveWatermark}
            className="w-max flex gap-2 
            transition-all duration-300
            max-w-[400px]
          bg-orange-500
          active:bg-orange-500
          hover:bg-orange-600
          py-4
        border-1 border-orange-200
         text-white"
          >
            <ZapIcon className="titlebar-icon fill-current" />
            {watermarkLinkLoading ? (
              <SmallLoader />
            ) : (
              <div>Remove watermark</div>
            )}
          </TitleBarButton>
        </a>
      )}
    </TitleBarRoot>
  );
};

export const useRemoveWatermarkLink = (tag: string) => {
  const { email, userId, isLoading } = useAuth();

  let watermarkLink: string | null = `${
    import.meta.env.VITE_SITE_ROOT
  }/compress/desktop/pricing?email=${email}&id=${userId}&watermark=true&tag=${tag}`;
  const watermarkLinkLoading = isLoading;
  if (!email || !userId) {
    watermarkLink = null;
  }

  let checkoutLink: string | null = `${
    import.meta.env.VITE_SITE_ROOT
  }/compress/desktop/buy?email=${email}&id=${userId}&tag=${tag}`;
  const checkoutLinkLoading = isLoading;
  if (!email || !userId) {
    checkoutLink = null;
  }

  return { watermarkLink, watermarkLinkLoading, checkoutLink, checkoutLinkLoading };
};

export const SmallLoader = () => {
  return <Loader2 className="w-4 h-4 animate-spin" />;
};
