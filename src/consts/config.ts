import type { ConfigEditorState } from "@/store/config";

export type EditorSettingConfig = {
  label: string;
  key: keyof Pick<
    ConfigEditorState,
    "wordWrap" | "lineNumbers" | "minimap" | "whiteSpace"
  >;
  description: string;
};

export const EDITOR_SETTINGS_CONFIG: EditorSettingConfig[] = [
  {
    label: "Word Wrap",
    key: "wordWrap",
    description: "Wrap long lines of code",
  },
  {
    label: "Line Numbers",
    key: "lineNumbers",
    description: "Show line numbers in the editor",
  },
  {
    label: "Minimap",
    key: "minimap",
    description: "Show minimap in the editor",
  },
  {
    label: "White Space",
    key: "whiteSpace",
    description: "Show white space in the editor",
  },
] as const;
