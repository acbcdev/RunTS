import type { lineRendererEditor } from "@/features/editor/types";

export type ConfigEditorActions = {
	updateConfig: (updates: Partial<ConfigEditorState>) => void;
	setConfigValue: <K extends keyof ConfigEditorState>(
		key: K,
		value: ConfigEditorState[K],
	) => void;
	resetConfig: () => void;
	toggleConfig: (
		key: keyof Pick<
			ConfigEditorState,
			"wordWrap" | "lineNumbers" | "whiteSpace" | "minimap" | "hideUndefined"
		>,
	) => void;
};

export type ConfigEditor = ConfigEditorState & ConfigEditorActions;

export type ConfigEditorState = {
	wordWrap: boolean;
	hideUndefined: boolean;
	lineNumbers: boolean;
	whiteSpace: boolean;
	refreshTime: number;
	minimap: boolean;
	updates: boolean;
	lineRenderer: lineRendererEditor;
	tabSize: number;
	insertSpaces: boolean;
	formatOnPaste: boolean;
	formatOnType: boolean;
	autoIndent: "none" | "keep" | "brackets" | "advanced" | "full";
	printWidth: number;
};
