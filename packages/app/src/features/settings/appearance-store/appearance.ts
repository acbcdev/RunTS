import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themes } from "@/features/common/themes";
import type {
  ApparenceStore,
  ApparenceStoreStates,
  sidePositions,
  sides,
} from "./types";

export const SIDES: Record<sidePositions, sides> = {
  TOP: 2,
  LEFT: 1,
  BOTTOM: 3,
  RIGHT: 0,
};

const DEFAULT_VALUES: ApparenceStoreStates = {
  theme: "oneDark",
  fontSize: 20,
  radius: "0.5",
  fontFamily: '"Cascadia Code"',
  layout: "horizontal",
  side: SIDES.TOP,
};

export const useApparenceStore = create<ApparenceStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_VALUES,
      getCurrentTheme: () => themes[get().theme],
      getOption: (key) => get()[key],
      setOption: (key, value) => set({ [key]: value }),
      updateApparence: (updates) => set((state) => ({ ...state, ...updates })),
      setApparence: (options) => set(() => options),
    }),
    {
      name: "apparence-store",
    }
  )
);
