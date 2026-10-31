import { check } from "@tauri-apps/plugin-updater";

import { useState, useEffect } from "react";
import { setWantsUpdate } from "./rust-function-calls";

export const useUpdateCheck = () => {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const checkForUpdate = async () => {
      const updateAvailable = await checkAppUpdate();
      setHasUpdate(updateAvailable);
    };

    // Check for update immediately
    checkForUpdate();

    // Set up interval to check every hour
    const intervalId = setInterval(checkForUpdate, 60 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return hasUpdate;
};

export const checkAppUpdate = async (): Promise<boolean> => {
  const update = await check();
  if (update) {
    console.log(
      `found update ${update.version} from ${update.date} with notes ${update.body}`
    );

    await setWantsUpdate();
    return true;
  }

  return false;
};
