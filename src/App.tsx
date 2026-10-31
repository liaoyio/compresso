import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { MainApp } from "./components/main-app";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";
import { Onboarding } from "./components/onboarding/onboarding";
import { useOnboarding } from "./components/onboarding/use-onboarding";
import useCompressoStore from "./lib/store/compresso-store";

const PosthogAPIKey = "phc_7cDaQupUg0KIJduAsBl00dYGxz8fpRL5oI8V0b9oQhM";
const PosthogHost = "https://eu.i.posthog.com";

const queryClient = new QueryClient();

posthog.init(PosthogAPIKey, {
  api_host: PosthogHost,
  person_profiles: "identified_only",
  capture_pageleave: false,
  capture_pageview: false,
  autocapture: false,
});

function App() {
  const posthog = usePostHog();
  const { onboardingCompleted } = useOnboarding();
  const { setLastVersion } = useCompressoStore((state) => ({
    setLastVersion: state.setLastVersion,
  }));

  useEffect(() => {
    getVersion().then((version) => {
      posthog.register({ version: version });
      posthog.capture("launched_app");
      posthog.people.set("currentVersion", version);
      setLastVersion(version);
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="compresso-ui-theme">
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          {onboardingCompleted ? <MainApp /> : <Onboarding />}
          {/* {isDev() && <DevBanner />} */}
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}

export default App;
