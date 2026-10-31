import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAccess } from "./auth/use-access";
import { useAuth } from "./auth/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserButtonContent } from "./file-preview/user-button";

export const DevBanner = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { email } = useAuth();
  const { hasPaid } = useAccess();

  const handleClick = () => {
    const nextHidden = !isHidden;
    setIsHidden(nextHidden);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        isHidden ? "hidden" : "",
        "absolute bottom-0 z-100 right-0 text-[0.5rem] bg-black/20",
        hasPaid ? "text-green-500" : "text-red-500"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>{email ?? "Logged out"}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <UserButtonContent setShowWhatsNew={() => {}} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
