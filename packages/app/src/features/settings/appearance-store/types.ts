import type { themes } from "@/features/common/themes";
import type { RadiusSize, Theme, TLayout } from "@/features/editor/types";

export type sides = 0 | 1 | 2 | 3;
export type sidePositions = "RIGHT" | "LEFT" | "TOP" | "BOTTOM";
export interface ApparenceStoreStates {
  theme: keyof typeof themes;
  fontSize: number;
  radius: RadiusSize;
  fontFamily: string;
  layout: TLayout;
  side: sides;
}

export interface ApparenceStoreActions {
  getCurrentTheme: () => Theme;
  getOption: <T extends keyof ApparenceStoreStates>(
    key: T
  ) => ApparenceStoreStates[T];
  setOption: <T extends keyof ApparenceStoreStates>(
    key: T,
    value: ApparenceStoreStates[T]
  ) => void;
  updateApparence: (updates: Partial<ApparenceStoreStates>) => void;
  setApparence: (options: ApparenceStoreStates) => void;
}

export type ApparenceStore = ApparenceStoreStates & ApparenceStoreActions;
