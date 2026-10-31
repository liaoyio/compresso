import { invoke } from "@tauri-apps/api/core";
import { PostHog } from "posthog-js/react";

export const showInFolder = async (path: string, postHog: PostHog) => {
  try {
    await invoke("show_in_folder", { path });
  } catch (e) {
    console.error(e);
    postHog.capture("caught_error", {
      name: "showInFolder",
      error: e,
      path,
    });
  }
};

export const openFile = async (path: string, postHog: PostHog) => {
  try {
    await invoke("open_file", { path });
  } catch (e) {
    console.error(e);
    postHog.capture("caught_error", {
      name: "openFile",
      error: e,
      path,
    });
  }
};

export const restartApp = async (postHog: PostHog) => {
  try {
    await invoke("restart_app");
  } catch (e) {
    console.error(e);
    postHog.capture("caught_error", {
      name: "restartApp",
      error: e,
    });
  }
};

export const setWantsUpdate = async () => {
  await invoke("wants_update_on_exit");
};
