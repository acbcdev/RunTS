import { themes } from "@/themes";
import type { RadiusSize, TLayout, Theme } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type sides = 0 | 1 | 2 | 3;

type sidePositions = "RIGHT" | "LEFT" | "TOP" | "BOTTOM";
export const SIDES: Record<sidePositions, sides> = {
	TOP: 2,
	LEFT: 1,
	BOTTOM: 3,
	RIGHT: 0,
};

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
		key: T,
	) => ApparenceStoreStates[T];
	setOption: <T extends keyof ApparenceStoreStates>(
		key: T,
		value: ApparenceStoreStates[T],
	) => void;
	updateApparence: (updates: Partial<ApparenceStoreStates>) => void;
	setApparence: (options: ApparenceStoreStates) => void;
}

type ApparenceStore = ApparenceStoreStates & ApparenceStoreActions;

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
		},
	),
);
