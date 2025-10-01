import type { editor } from "monaco-editor";

export type ThemeProps = {
  name: string;
  base?: editor.BuiltinTheme;
  ui: {
    background: string;
    foreground: string;
    border: string;
    accent: string;
    selection: string;
    header: string;
    hover: string;
    muted: string;
    warning: string;
    error: string;
    success: string;
    info: string;
  };
  monaco: {
    comment: string;
    keyword: string;
    string: string;
    number: string;
    operator: string;

    function: string;
    variable: string;
    type: string;
    BracketHighlight1?: string;
    BracketHighlight2?: string;
    BracketHighlight3?: string;
  };
};
