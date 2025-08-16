import type { lineRendererEditor } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type ConfigEditorState = {
  wordWrap: boolean;
  hideUndefined: boolean;
  lineNumbers: boolean;
  whiteSpace: boolean;
  refreshTime: number;
  minimap: boolean;
  updates: boolean;
  lineRenderer: lineRendererEditor;
};

export type ConfigEditorActions = {
  updateConfig: (updates: Partial<ConfigEditorState>) => void;
  setConfigValue: <K extends keyof ConfigEditorState>(
    key: K,
    value: ConfigEditorState[K]
  ) => void;
  resetConfig: () => void;
};

type ConfigEditor = ConfigEditorState & ConfigEditorActions;

const DEFAULT_CONFIG: ConfigEditorState = {
  updates: true,
  wordWrap: true,
  lineNumbers: true,
  whiteSpace: true,
  refreshTime: 200,
  minimap: true,
  lineRenderer: "line",
  hideUndefined: true,
};

export const useConfigStore = create<ConfigEditor>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      updateConfig: (updates) => set((state) => ({ ...state, ...updates })),
      setConfigValue: (key, value) =>
        set((state) => ({ ...state, [key]: value })),
      resetConfig: () => set(DEFAULT_CONFIG),
    }),
    {
      name: "config-editor-store",
    }
  )
);
