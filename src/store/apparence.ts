import { themes } from "@/themes";
import type { Theme } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type Radius = "0" | "0.3" | "0.5" | "0.8" | "1";
type TLayout = "vertical" | "horizontal";

interface ApparenceStore {
  theme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  getCurrentTheme: () => Theme;
  radius: Radius;
  setRadius: (radius: Radius) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  layout: TLayout;
  setLayout: (layout: TLayout) => void;
}
themes;
export const useApparenceStore = create<ApparenceStore>()(
  persist(
    (set, get) => ({
      theme: "oneDark",
      setTheme: (theme) => set({ theme }),
      getCurrentTheme: () => themes[get().theme],
      fontSize: 20,
      setFontSize: (fontSize) => set({ fontSize }),
      radius: "0.5",
      setRadius: (radius) => set({ radius }),
      fontFamily: '"Cascadia Code", monospace',
      setFontFamily: (fontFamily) => set({ fontFamily }),
      layout: "horizontal",
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "apparence-store",
    }
  )
);
