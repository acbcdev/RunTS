import { themes } from "@/themes";
import type { RadiusSize, TLayout, Theme } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApparenceStore {
  getCurrentTheme: () => Theme;
  theme: keyof typeof themes;
  fontSize: number;
  radius: RadiusSize;
  fontFamily: string;
  layout: TLayout;
  getOption: <T extends keyof AppearanceOptions>(
    key: T
  ) => AppearanceOptions[T];
  setOption: <T extends keyof AppearanceOptions>(
    key: T,
    value: ApparenceStore[T]
  ) => void;
}
export type AppearanceOptions = Pick<
  ApparenceStore,
  "theme" | "fontSize" | "radius" | "fontFamily" | "layout"
>;
export const useApparenceStore = create<ApparenceStore>()(
  persist(
    (set, get) => ({
      getCurrentTheme: () => themes[get().theme],
      theme: "oneDark",
      fontSize: 20,
      radius: "0.5",
      fontFamily: '"Cascadia Code"',
      layout: "horizontal",
      getOption: (key) => get()[key],
      setOption: (key, value) => set({ [key]: value }),
    }),
    {
      name: "apparence-store",
    }
  )
);
