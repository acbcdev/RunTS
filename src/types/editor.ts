// EditorState.ts
import type { editor } from "monaco-editor";
import type { ConsoleOutput } from "./worker";

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
	logs: ConsoleOutput[];
	editing?: boolean;
}
