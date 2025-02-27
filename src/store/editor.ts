import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
	expression: boolean;
	setExpression: (value: boolean) => void;
	alignLogs: boolean;
	setAlignLogs: (value: boolean) => void;
	monaco: Monaco | null;
	editorRef: editor.IStandaloneCodeEditor | null;
	running: boolean;
	setRunning: (value: boolean) => void;
	setMonaco: (monaco: Monaco) => void;
	setEditorRef: (editor: editor.IStandaloneCodeEditor) => void;
}

export const useEditorStore = create<EditorState>()(
	persist(
		(set) => ({
			alignLogs: true,
			setAlignLogs: (alignLogs) => set({ alignLogs }),
			expression: true,
			setExpression: (expression) => set({ expression }),
			monaco: null,
			setMonaco: (monaco) => set({ monaco }),
			running: false,
			setRunning: (running) => set({ running }),
			editorRef: null,
			setEditorRef: (editor) => set({ editorRef: editor ?? null }),
		}),
		{
			name: "editor",
			partialize: (state) => ({
				alignLogs: state.alignLogs,

				expression: state.expression,
				monaco: state.monaco,
				editorRef: state.editorRef,
			}),
		},
	),
);
