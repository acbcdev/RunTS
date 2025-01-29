import { create } from "zustand";
import { persist } from "zustand/middleware";
export type ConfigEditor = {
  wordWrap: boolean;
  lineNumbers: boolean;
  whiteSpace: boolean;
  refreshTime: number;
  minimap: boolean;
  updates: boolean;
  getOption: <T extends keyof ConfigOptions>(key: T) => ConfigOptions[T];
  setOption: <T extends keyof ConfigOptions>(
    key: T,
    value: ConfigOptions[T]
  ) => void;
};
export type ConfigOptions = Pick<
  ConfigEditor,
  | "wordWrap"
  | "lineNumbers"
  | "minimap"
  | "whiteSpace"
  | "refreshTime"
  | "updates"
>;
export const useConfigStore = create<ConfigEditor>()(
  persist(
    (set, get) => ({
      updates: true,
      wordWrap: true,
      lineNumbers: true,
      whiteSpace: true,
      refreshTime: 200,
      minimap: true,
      getOption: (key) => get()[key],
      setOption: (key, value) => set({ [key]: value }),
    }),
    {
      name: "config-editor-store",
    }
  )
);
