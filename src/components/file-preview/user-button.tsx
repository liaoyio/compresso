import { HelpCircleIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { isDev, resetCompresso } from "@/lib/reset-compresso";
import { useGettingStarted } from "./empty-preview";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useState } from "react";
import { WhatsNew } from "../whats-new";
import { useReleaseNotes } from "@/lib/use-release-notes";
import useCompressoStore from "@/lib/store/compresso-store";

const WhatsNewBadge = () => {
  return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
};

export const UserButton = () => {
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const { hasSeenWhatsNew } = useReleaseNotes();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="relative flex m-2 p-2 ">
            {!hasSeenWhatsNew ? (
              <User2Icon className="w-5 h-5" />
            ) : (
              <User2Icon className="w-4 h-4" />
            )}

            {!hasSeenWhatsNew && (
              <div className="absolute top-0 right-0">
                <WhatsNewBadge />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <UserButtonContent setShowWhatsNew={setShowWhatsNew} />
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={showWhatsNew} onOpenChange={setShowWhatsNew}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>更新内容</SheetTitle>
          </SheetHeader>
          <WhatsNew />
        </SheetContent>
      </Sheet>
    </>
  );
};

export const UserButtonContent = ({
  setShowWhatsNew,
}: {
  setShowWhatsNew: (showWhatsNew: boolean) => void;
}) => {
  const resetEverything = resetCompresso();
  const { setHasDismissedGettingStarted, hasDismissedGettingStarted } =
    useGettingStarted();

  const { hasSeenWhatsNew } = useReleaseNotes();
  return (
    <>
      <DropdownMenuLabel className="gap-2 flex">Compresso</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="flex items-center justify-between"
        onClick={() => setShowWhatsNew(true)}
      >
        <div>更新内容</div>
        {!hasSeenWhatsNew && <WhatsNewBadge />}
      </DropdownMenuItem>

      <DropdownMenuItem onClick={resetEverything}>
        重置 Compresso
      </DropdownMenuItem>

      {/* Show the getting started video */}
      <DropdownMenuItem
        onClick={() =>
          setHasDismissedGettingStarted(!hasDismissedGettingStarted)
        }
      >
        {hasDismissedGettingStarted ? "显示" : "隐藏"}新手引导
      </DropdownMenuItem>

      <DropdownMenuItem>
        <a href="https://docs.compresso.app" className="flex items-center" target="_blank">
          <HelpCircleIcon className="w-4 h-4 mr-2" />
          帮助与文档
        </a>
      </DropdownMenuItem>

      <NeedHelpButton />

      {isDev() && <DeveloperMenu />}
    </>
  );
};

import { writeText } from "@tauri-apps/plugin-clipboard-manager";
const NeedHelpButton = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyEmailToClipboard = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    await writeText("compresso-help@rotato.app");
    setIsCopied(true);
  };
  return (
    <DropdownMenuItem
      onClick={copyEmailToClipboard}
      className="flex items-center"
    >
      
      {isCopied ? "已复制！" : "compresso-help@rotato.app"}
    </DropdownMenuItem>
  );
};

const DeveloperMenu = () => {
  const { setSeenWhatsNewVersion } = useCompressoStore((state) => ({
    setSeenWhatsNewVersion: state.setSeenWhatsNewVersion,
  }));

  return (
    <>
      <Separator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        开发者
      </DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setSeenWhatsNewVersion(null)}>
        重置「更新内容」
      </DropdownMenuItem>
    </>
  );
};
