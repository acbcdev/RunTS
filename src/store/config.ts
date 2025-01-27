import { create } from "zustand";
import { persist } from "zustand/middleware";
type ConfigEditor = {
  wordWrap: boolean;
  lineNumbers: boolean;
  whiteSpace: boolean;
  refreshTime: number;
  minimap: boolean;
  updates: boolean;
  setUpdates: (enabled: boolean) => void;
  setWordWrap: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
  setWhiteSpace: (enabled: boolean) => void;
  setRefreshTime: (time: number) => void;
  setMinimap: (enabled: boolean) => void;
};
export const useConfigStore = create<ConfigEditor>()(
  persist(
    (set) => ({
      updates: true,
      setUpdates: (enabled) => set({ updates: enabled }),
      wordWrap: true,
      setWordWrap: (enabled) => set({ wordWrap: enabled }),
      lineNumbers: true,
      setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
      whiteSpace: true,
      setWhiteSpace: (enabled) => set({ whiteSpace: enabled }),
      refreshTime: 200,
      setRefreshTime: (time) => set({ refreshTime: time }),
      minimap: true,
      setMinimap: (enabled) => set({ minimap: enabled }),
    }),
    {
      name: "config-editor-store",
    }
  )
);
