import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConfigEditor, ConfigEditorState } from "./types";

const DEFAULT_CONFIG: ConfigEditorState = {
	updates: true,
	wordWrap: true,
	lineNumbers: true,
	whiteSpace: true,
	minimap: true,
	hideUndefined: true,
	refreshTime: 200,
	lineRenderer: "line",
	tabSize: 2,
	insertSpaces: true,
	formatOnPaste: true,
	formatOnType: true,
	autoIndent: "full",
	printWidth: 80,
};

export const useConfigStore = create<ConfigEditor>()(
	persist(
		(set) => ({
			...DEFAULT_CONFIG,
			updateConfig: (updates) => set((state) => ({ ...state, ...updates })),
			setConfigValue: (key, value) =>
				set((state) => ({ ...state, [key]: value })),
			toggleConfig: (key) => set((state) => ({ ...state, [key]: !state[key] })),
			resetConfig: () => set(DEFAULT_CONFIG),
		}),
		{
			name: "config-editor-store",
		},
	),
);
