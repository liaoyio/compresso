import { getVersion } from "@tauri-apps/api/app";
import posthog from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useRef } from "react";

export const useTrackAppearance = (event: string, properties?: any) => {
  const postHog = usePostHog();

  useEffect(() => {
    getVersion().then((version) => {
      postHog.capture(event, { ...properties, version });
    });
  }, []);
};

export const useTrackHasUsed = () => {
  const postHog = usePostHog();
  const hasUsed = useRef<string[]>([]);

  const trackHasUsed = useCallback(
    async (featureName: string) => {
      const propertyName = `has_used_${featureName}`;

      const hasTracked = hasUsed.current.includes(featureName);

      if (!hasTracked) {
        const version = await getVersion();
        postHog.people.set({ [propertyName]: true });
        posthog.people.set({ has_used_settings: true });
        postHog.capture(`changed_setting_in_session`, {
          version,
          setting_name: featureName,
        });
        hasUsed.current.push(featureName);
      }
    },
    [postHog]
  );

  return trackHasUsed;
};
