import { themes } from "@/themes";
import type { Theme } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type Radius = "0" | "0.3" | "0.5" | "0.8" | "1";
type TLayout = "vertical" | "horizontal";

interface ApparenceStore {
  getCurrentTheme: () => Theme;

  options: {
    theme: keyof typeof themes;
    fontSize: number;
    radius: Radius;
    fontFamily: string;
    layout: TLayout;
  };
  setOptions: (options: ApparenceStore["options"]) => void;
  setOption: <T extends keyof ApparenceStore["options"]>(
    key: T,
    value: ApparenceStore["options"][T]
  ) => void;
}
themes;
export const useApparenceStore = create<ApparenceStore>()(
  persist(
    (set, get) => ({
      getCurrentTheme: () => themes[get().options.theme],
      options: {
        theme: "oneDark",
        fontSize: 20,
        radius: "0.5",
        fontFamily: '"Cascadia Code"',
        layout: "horizontal",
      },
      setOptions: (options) => set({ options }),
      setOption: (key, value) =>
        set((state) => ({ options: { ...state.options, [key]: value } })),
    }),
    {
      name: "apparence-store",
    }
  )
);
