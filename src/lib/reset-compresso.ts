// Reset auth, hasPaid, onboardingCompleted, zustand store, local storage, cookies, posthog

import { useAuth } from "@/components/auth/use-auth";
import useCompressoStore from "./store/compresso-store";
import { usePostHog } from "posthog-js/react";

export const resetCompresso = () => {
  const { signOut } = useAuth();
  const { reset } = useCompressoStore((state) => ({ reset: state.reset }));
  const posthog = usePostHog();

  const resetEverything = () => {
    // log out
    signOut();
    // reset the store
    reset();
    // reset posthog
    posthog.reset();
    // clear all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // clear local storage
    localStorage.clear();
  };

  return resetEverything;
};

export const isDev = () => {
  return import.meta.env.DEV;
};
