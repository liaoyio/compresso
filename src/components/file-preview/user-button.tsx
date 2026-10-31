import { HelpCircleIcon, User2Icon } from "lucide-react";
import { useAuth } from "../auth/use-auth";
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
import { useOnboarding } from "../onboarding/use-onboarding";
import { useAccess } from "../auth/use-access";
import { Badge } from "../ui/badge";
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
            <SheetTitle>What's new?</SheetTitle>
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
  const { email, signOut } = useAuth();
  const { hasPaid } = useAccess();
  const resetEverything = resetCompresso();
  const { setHasDismissedGettingStarted, hasDismissedGettingStarted } =
    useGettingStarted();

  const { hasSeenWhatsNew } = useReleaseNotes();
  return (
    <>
      <DropdownMenuLabel className="gap-2 flex">
        {email ?? "Not logged in"}
        <Badge>{hasPaid ? "PRO" : "FREE"}</Badge>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="flex items-center justify-between"
        onClick={() => setShowWhatsNew(true)}
      >
        <div>What's new?</div>
        {!hasSeenWhatsNew && <WhatsNewBadge />}
      </DropdownMenuItem>

      <DropdownMenuItem onClick={resetEverything}>
        Reset Compresso
      </DropdownMenuItem>

      {/* Show the getting started video */}
      <DropdownMenuItem
        onClick={() =>
          setHasDismissedGettingStarted(!hasDismissedGettingStarted)
        }
      >
        {hasDismissedGettingStarted ? "Show" : "Hide"} Getting Started
      </DropdownMenuItem>

      <DropdownMenuItem>
        <a href="https://docs.compresso.app" className="flex items-center" target="_blank">
          <HelpCircleIcon className="w-4 h-4 mr-2" />
          Help & Docs
        </a>
      </DropdownMenuItem>

      <NeedHelpButton />

      {email && <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>}

      {/* reset onboarding for testing */}
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
      
      {isCopied ? "Copied!" : "compresso-help@rotato.app"}
    </DropdownMenuItem>
  );
};

const DeveloperMenu = () => {
  const { setOnboardingCompleted } = useOnboarding();
  const { setSeenWhatsNewVersion } = useCompressoStore((state) => ({
    setSeenWhatsNewVersion: state.setSeenWhatsNewVersion,
  }));

  return (
    <>
      <Separator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Dev
      </DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setSeenWhatsNewVersion(null)}>
        Reset Whats New
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setOnboardingCompleted(false)}>
        Reset Onboarding
      </DropdownMenuItem>
    </>
  );
};
