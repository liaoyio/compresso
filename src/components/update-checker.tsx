import { useState } from "react";
import { Button } from "./ui/button";

import { restartApp } from "@/lib/rust-function-calls";
import { useUpdateCheck } from "@/lib/use-update-check";
import { usePostHog } from "posthog-js/react";

export const UpdateChecker = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const hasUpdate = useUpdateCheck();

  if (isDismissed) return null;
  if (!hasUpdate) return null;

  const posthog = usePostHog();

  return (
    <div
      className="
      absolute bottom-4 left-1/2 transform -translate-x-1/2 
    p-2 px-3 bg-foreground text-background 
    rounded-lg shadow-lg flex items-center
    "
    >
      <div className="hidden sm:block mr-4 truncate w-full">
        Compresso will update when you restart the app.
      </div>
      <div className="block sm:hidden mr-4 truncate w-full">Update now?</div>

      <Button
        variant="secondary"
        className="mr-2 px-6 bg-background/5 text-background hover:bg-background/10"
        onClick={() => setIsDismissed(true)}
      >
        Later
      </Button>
      <Button
        onClick={async () => {
          await restartApp(posthog);
        }}
        className="bg-blue-600 text-foreground px-4 py-2 rounded-md font-medium text-white hover:bg-blue-700"
      >
        Restart Now
      </Button>
    </div>
  );
};
