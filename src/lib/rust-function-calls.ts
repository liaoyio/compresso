import { invoke } from "@tauri-apps/api/core";

export const showInFolder = async (path: string) => {
  try {
    await invoke("show_in_folder", { path });
  } catch (e) {
    console.error(e);
  }
};

export const openFile = async (path: string) => {
  try {
    await invoke("open_file", { path });
  } catch (e) {
    console.error(e);
  }
};
