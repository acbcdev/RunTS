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
