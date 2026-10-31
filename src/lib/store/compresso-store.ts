import { create } from "zustand";
import { CompressoFile } from "./use-compresso-files";
import { defaultConfig, OptimizeConfig } from "../optimizer/types";
import { OptimizePreset, PresetStore } from "./preset-store";
import { persist, createJSONStorage } from "zustand/middleware";
import { NumericSetting, numericSettings } from "./numeric-settings";

export type FileStatus = "ready" | "waiting" | "compressing" | "done" | "error";

type State = {
  isRunning: boolean;
  files: CompressoFile[];

  config: OptimizeConfig;
  customValues: Partial<Record<NumericSetting, number>>;
  customModes: Partial<Record<NumericSetting, boolean>>;
  preset: OptimizePreset;
  isHoveringTitleBar: boolean;
  selectedFileIds: string[];
  settingsIsOpen: boolean;
  reCompressFileIds: string[];
  isPinned: boolean;
  onboardingCompleted: boolean;
  hasPaid: boolean;
  hasDismissedGettingStarted: boolean;
  didLoginDuringOnboarding: boolean;
  pendingActionsAfterLogin: (() => void)[];
  lastVersion: string | null;
  seenWhatsNewVersion: string | null;


};

type Actions = {
  setFiles: (files: CompressoFile[]) => void;
  addFile: (file: CompressoFile) => void;
  setOptimizeConfig: (config: OptimizeConfig) => void;
  resetOptimizeConfig: () => void;
  selectNumericSetting: (setting: NumericSetting, selection: string) => void;
  setCustomValue: (setting: NumericSetting, value: number) => void;
  setPreset: (preset: OptimizePreset) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsHoveringTitleBar: (isHoveringTitleBar: boolean) => void;
  setSelectedFileIds: (selectedFileIds: string[]) => void;
  toggleSettings: () => void;
  queueFileForRecompress: (fileId: string) => void;
  removeFileFromRecompressQueue: (fileId: string) => void;
  setIsPinned: (isPinned: boolean) => void;
  setOnboardingCompleted: (onboardingCompleted: boolean) => void;
  setHasPaid: (hasPaid: boolean) => void;
  reset: () => void;
  setHasDismissedGettingStarted: (hasDismissedGettingStarted: boolean) => void;
  setDidLoginDuringOnboarding: (didLoginDuringOnboarding: boolean) => void;
  addPendingActionAfterLogin: (action: () => void) => void;
  purgePendingActionsAfterLogin: () => void;
  setLastVersion: (version: string) => void;
  setSeenWhatsNewVersion: (version: string | null) => void;
  setFileStatus: (fileId: string, status: FileStatus) => void;
};

const initialState: State = {
  isRunning: false,
  files: [],
  config: defaultConfig,
  customValues: {},
  customModes: {},
  preset: PresetStore[0],
  isHoveringTitleBar: false,
  selectedFileIds: [],
  settingsIsOpen: false,
  reCompressFileIds: [],
  isPinned: false,
  onboardingCompleted: false,
  hasPaid: false,
  hasDismissedGettingStarted: false,
  didLoginDuringOnboarding: false,
  pendingActionsAfterLogin: [],
  lastVersion: null,
  seenWhatsNewVersion: null,
};

const useCompressoStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setFiles: (files) => set({ files }),
      addFile: (file) => set((state) => ({ files: [...state.files, file] })),
      setOptimizeConfig: (config) => set({ config }),
      resetOptimizeConfig: () => set({ config: defaultConfig, customModes: {} }),
      selectNumericSetting: (setting, selection) =>
        set((state) => {
          const definition = numericSettings[setting];
          const isCustom = selection === "custom";
          const option = isCustom
            ? {
                value: state.customValues[setting] ?? state.config[setting] ??
                  definition.defaultCustomValue,
              }
            : definition.options.find((option) => option.id === selection);
          if (!option) return state;
          const { value } = option;
          return {
            config: { ...state.config, [setting]: value },
            customModes: { ...state.customModes, [setting]: isCustom },
            customValues: isCustom
              ? { ...state.customValues, [setting]: value }
              : state.customValues,
          };
        }),
      setCustomValue: (setting, value) => {
        if (!Number.isFinite(value) || value <= 0) return;
        set((state) => ({
          config: { ...state.config, [setting]: value },
          customModes: { ...state.customModes, [setting]: true },
          customValues: { ...state.customValues, [setting]: value },
        }));
      },
      setPreset: (preset) => set({ preset, config: preset.config, customModes: {} }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setIsHoveringTitleBar: (isHoveringTitleBar) =>
        set({ isHoveringTitleBar }),
      setSelectedFileIds: (selectedFileIds) => set({ selectedFileIds }),
      toggleSettings: () =>
        set((state) => ({ settingsIsOpen: !state.settingsIsOpen })),
      queueFileForRecompress: (fileId) =>
        set((state) => ({
          reCompressFileIds: [...state.reCompressFileIds, fileId],
        })),
      removeFileFromRecompressQueue: (fileId) =>
        set((state) => ({
          reCompressFileIds: state.reCompressFileIds.filter(
            (id) => id !== fileId
          ),
        })),
      setIsPinned: (isPinned) => set({ isPinned }),
      setOnboardingCompleted: (onboardingCompleted) =>
        set({ onboardingCompleted }),
      setHasPaid: (hasPaid) => set({ hasPaid }),
      reset: () => set(initialState),
      setHasDismissedGettingStarted: (dismissed) =>
        set({ hasDismissedGettingStarted: dismissed }),
      setDidLoginDuringOnboarding: (didLoginDuringOnboarding) =>
        set({ didLoginDuringOnboarding }),
      addPendingActionAfterLogin: (action) =>
        set((state) => ({
          pendingActionsAfterLogin: [...state.pendingActionsAfterLogin, action],
        })),
      purgePendingActionsAfterLogin: () =>
        set({ pendingActionsAfterLogin: [] }),
      setLastVersion: (version) => set({ lastVersion: version }),
      setSeenWhatsNewVersion: (version) =>
        set({ seenWhatsNewVersion: version }),
      setFileStatus: (fileId, status) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId ? { ...file, status } : file
          ),
        })),
      
    }
  
  ),
    

    {
      name: "compresso-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customValues: state.customValues,
        onboardingCompleted: state.onboardingCompleted,
        hasPaid: state.hasPaid,
        hasDismissedGettingStarted: state.hasDismissedGettingStarted,
        lastVersion: state.lastVersion,
        seenWhatsNewVersion: state.seenWhatsNewVersion,
      }),
    }
  )
);

export default useCompressoStore;
