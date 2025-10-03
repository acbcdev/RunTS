// EditorState.ts
import type { editor } from "monaco-editor";

export interface Theme {
	name: string;
	value: string;
	ui: {
		background: string;
		foreground: string;
		border: string;
		accent: string;
		selection: string;
		header: string;
		hover: string;
		muted: string;
		success: string;
		warning: string;
		error: string;
		info: string;
	};
	monaco: editor.IStandaloneThemeData;
}

export interface Tab {
	id: string;
	name: string;
	language: string;
	code: string;
	log: string;
	editing?: boolean;
	createdAt: number;
	updatedAt: number;
}

export type lineRendererEditor = "none" | "gutter" | "line" | "all";

export type RadiusSize = "0" | "0.3" | "0.5" | "0.75" | "1";
export type Radius = {
	display: string;
	size: RadiusSize;
};
export type TLayout = "vertical" | "horizontal";
