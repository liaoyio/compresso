import { invoke } from "@tauri-apps/api/core";

export const expandScope = async (folderPath: string) => {
  return await invoke("expand_scope", { folderPath });
};
