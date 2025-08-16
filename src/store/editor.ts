import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
  expression: boolean;
  alignLogs: boolean;
  monaco: Monaco | null;
  editorRef: editor.IStandaloneCodeEditor | null;
  running: boolean;
}
interface EditorActions {
  updateEditor: (updates: Partial<EditorState>) => void;
  setEditorValue: <K extends keyof EditorState>(
    key: K,
    value: EditorState[K]
  ) => void;
  resetEditor: () => void;
}
type Editor = EditorState & EditorActions;

const DEFAULT_VALUES: EditorState = {
  expression: true,
  alignLogs: true,
  monaco: null,
  editorRef: null,
  running: false,
};

export const useEditorStore = create<Editor>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES,
      updateEditor: (updates) => set((state) => ({ ...state, ...updates })),
      setEditorValue: (key, value) =>
        set((state) => ({ ...state, [key]: value })),
      resetEditor: () => set({ ...DEFAULT_VALUES }),
    }),
    {
      name: "editorV2",
      partialize: (state) => ({
        alignLogs: state.alignLogs,
        expression: state.expression,
      }),
    }
  )
);
