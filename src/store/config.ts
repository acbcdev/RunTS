import { create } from "zustand";
import { persist } from "zustand/middleware";
export type Radius = "0" | "0.3" | "0.5" | "0.8" | "1";
type TLayout = "vertical" | "horizontal";
type ConfigEditor = {
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  whiteSpace: boolean;
  fontFamily: string;
  refreshTime: number;
  minimap: boolean;
  layout: TLayout;
  updates: boolean;
  radius: Radius;
  setRadius: (radius: Radius) => void;
  setUpdates: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setWordWrap: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
  setWhiteSpace: (enabled: boolean) => void;
  setFontFamily: (fontFamily: string) => void;
  setRefreshTime: (time: number) => void;
  setMinimap: (enabled: boolean) => void;
  setLayout: (layout: TLayout) => void;
};
export const useConfigStore = create<ConfigEditor>()(
  persist(
    (set) => ({
      updates: true,
      fontSize: 18,
      wordWrap: true,
      lineNumbers: true,
      whiteSpace: true,
      fontFamily: '"Cascadia Code"',
      refreshTime: 200,
      minimap: true,
      layout: "horizontal",
      radius: "0.5",
      setRadius: (radius) => set({ radius }),
      setUpdates: (enabled) => set({ updates: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      setWordWrap: (enabled) => set({ wordWrap: enabled }),
      setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
      setWhiteSpace: (enabled) => set({ whiteSpace: enabled }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setRefreshTime: (time) => set({ refreshTime: time }),
      setMinimap: (enabled) => set({ minimap: enabled }),
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "config-editor-store",
    }
  )
);
