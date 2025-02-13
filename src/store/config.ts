import type { lineRendererEditor } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type ConfigEditor = {
	wordWrap: boolean;
	lineNumbers: boolean;
	whiteSpace: boolean;
	refreshTime: number;
	minimap: boolean;
	updates: boolean;
	lineRenderer: lineRendererEditor;
	setWordWrap: (value: boolean) => void;
	setLineNumbers: (value: boolean) => void;
	setWhiteSpace: (value: boolean) => void;
	setRefreshTime: (value: number) => void;
	setMinimap: (value: boolean) => void;
	setUpdates: (value: boolean) => void;
	setLineRenderer: (value: lineRendererEditor) => void;
};

export const useConfigStore = create<ConfigEditor>()(
	persist(
		(set) => ({
			updates: true,
			wordWrap: true,
			lineNumbers: true,
			whiteSpace: true,
			refreshTime: 200,
			minimap: true,
			lineRenderer: "line",
			setLineRenderer: (lineRenderer) => set({ lineRenderer }),
			setWordWrap: (wordWrap) => set({ wordWrap }),
			setLineNumbers: (lineNumbers) => set({ lineNumbers }),
			setWhiteSpace: (whiteSpace) => set({ whiteSpace }),
			setRefreshTime: (refreshTime) => set({ refreshTime }),
			setMinimap: (minimap) => set({ minimap }),
			setUpdates: (updates) => set({ updates }),
		}),
		{
			name: "config-editor-store",
		},
	),
);
