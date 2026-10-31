import useCompressoStore from "./compresso-store";

// Title Bar
export const useTitleBar = () => {
  const isHoveringTitleBar = useCompressoStore(
    (state) => state.isHoveringTitleBar
  );
  const setIsHoveringTitleBar = useCompressoStore(
    (state) => state.setIsHoveringTitleBar
  );

  return { isHoveringTitleBar, setIsHoveringTitleBar };
};

// Selection
export const useFileSelection = () => {
  const selectedFileIds = useCompressoStore((state) => state.selectedFileIds);
  const setSelectedFileIds = useCompressoStore(
    (state) => state.setSelectedFileIds
  );

  const selectedFiles = useCompressoStore((state) =>
    state.files.filter((file) => selectedFileIds.includes(file.id))
  );

  // for now just overwriting the selection until we have a multi-select
  const selectFileId = (fileId: string) => {
    setSelectedFileIds([fileId]);
  };

  return { selectedFileIds, setSelectedFileIds, selectFileId, selectedFiles };
};

// import { PhysicalSize, Window } from "@tauri-apps/api/window";
export const useSettings = () => {
  const settingsIsOpen = useCompressoStore((state) => state.settingsIsOpen);
  const performToggleSettings = useCompressoStore(
    (state) => state.toggleSettings
  );

  const toggleSettings = async () => {
    performToggleSettings();
  };

  return { settingsIsOpen, toggleSettings };
};

export const useOptimizeConfig = () => {
  const optimizeConfig = useCompressoStore((state) => state.config);
  const setOptimizeConfig = useCompressoStore(
    (state) => state.setOptimizeConfig
  );

  const resetConfig = useCompressoStore((state) => state.resetOptimizeConfig);

  return { optimizeConfig, setOptimizeConfig, resetConfig };
};
