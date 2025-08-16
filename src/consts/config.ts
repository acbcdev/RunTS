import type { ConfigEditorState } from "@/store/config";
import type { Radius, lineRendererEditor } from "@/types/editor";

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

export const FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export const REFRESH_TIMES = [
  { value: 0, time: "off" },
  { value: 100, time: "100ms" },
  { value: 200, time: "200ms" },
  { value: 300, time: "300ms" },
  { value: 400, time: "400ms" },
  { value: 500, time: "500ms" },
  { value: 700, time: "700ms" },
  { value: 800, time: "800ms" },
  { value: 1000, time: "1s" },
  { value: 2000, time: "2s" },
  { value: 3000, time: "3s" },
];

export const RENDER_LINES: lineRendererEditor[] = [
  "none",
  "gutter",
  "line",
  "all",
];
export const FONT_FAMILIES = [
  { name: "Cascadia Code", value: '"Cascadia Code"' },
  { name: "Fira Code", value: '"Fira Code"' },
  { name: "Monocraft", value: "Monocraft" },
];
type TLayout = "vertical" | "horizontal";
export const LAYOUTS: TLayout[] = ["vertical", "horizontal"];
export const RADIUS_SIZES: Radius[] = [
  { display: "Sharp", size: "0" },
  { display: "Slight", size: "0.3" },
  { display: "Medium", size: "0.5" },
  { display: "Smooth", size: "0.75" },
  { display: "Curved", size: "1" },
];
