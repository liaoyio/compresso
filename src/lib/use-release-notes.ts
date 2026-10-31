import { useCallback, useEffect } from "react";
import useCompressoStore from "./store/compresso-store";

export const useReleaseNotes = () => {
  const { lastVersion, seenWhatsNewVersion, setSeenWhatsNewVersion } =
    useCompressoStore((state) => ({
      lastVersion: state.lastVersion,
      seenWhatsNewVersion: state.seenWhatsNewVersion,
      setSeenWhatsNewVersion: state.setSeenWhatsNewVersion,
    }));

  /** Whether the current version's release notes have been seen */
  const hasSeenWhatsNew = seenWhatsNewVersion === lastVersion;

  /** Marks the current version's release notes as seen */
  const setSeenWhatsNew = useCallback(() => {
    if (lastVersion) {
      setSeenWhatsNewVersion(lastVersion);
    }
  }, [lastVersion, setSeenWhatsNewVersion]);

  return {
    hasSeenWhatsNew,
    setSeenWhatsNew,
  };
};

/** Marks the current version's release notes as seen when the component mounts */
export const useMarkWhatsNewAsSeenOnMount = () => {
  const { setSeenWhatsNew } = useReleaseNotes();

  useEffect(() => {
    setSeenWhatsNew();
  }, []);
};
