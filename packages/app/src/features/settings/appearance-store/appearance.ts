import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themes } from "@/features/common/themes";
import type { Theme } from "@/features/editor/types";
import type {
	ApparenceStore,
	ApparenceStoreStates,
	sidePositions,
	sides,
} from "./types";

const applyThemeToDOM = (currentTheme: Theme) => {
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	metaThemeColor?.setAttribute("content", currentTheme.ui.header);
	document.documentElement.style.setProperty(
		"--background",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--card",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--card-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--popover",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--popover-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--primary",
		currentTheme.ui.accent,
	);
	document.documentElement.style.setProperty(
		"--primary-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--secondary",
		currentTheme.ui.muted,
	);
	document.documentElement.style.setProperty(
		"--secondary-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty("--muted", currentTheme.ui.muted);
	document.documentElement.style.setProperty(
		"--muted-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--accent",
		currentTheme.ui.accent,
	);
	document.documentElement.style.setProperty(
		"--accent-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--destructive",
		currentTheme.ui.error,
	);
	document.documentElement.style.setProperty(
		"--destructive-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--border",
		currentTheme.ui.border,
	);
	document.documentElement.style.setProperty("--input", currentTheme.ui.border);
	document.documentElement.style.setProperty(
		"--header",
		currentTheme.ui.header,
	);
	document.documentElement.style.setProperty(
		"--ring",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty("--info", currentTheme.ui.info);
	document.documentElement.style.setProperty(
		"--success",
		currentTheme.ui.success,
	);
};

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
			applyTheme: () => applyThemeToDOM(themes[get().theme]),
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
