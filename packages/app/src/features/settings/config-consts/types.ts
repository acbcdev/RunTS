import type { ConfigEditorState } from "../config-store/types";

export type EditorSettingConfig = {
  label: string;
  key: keyof Pick<
    ConfigEditorState,
    "wordWrap" | "lineNumbers" | "minimap" | "whiteSpace"
  >;
  description: string;
};
