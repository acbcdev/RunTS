import type { Theme } from "../types/editor";

export const themes: Record<string, Theme> = {
  oneDark: {
    name: "One Dark",
    value: "oneDark",
    ui: {
      background: "#282c34",
      foreground: "#abb2bf",
      border: "#3e4451",
      accent: "#c372fc",
      selection: "#3e4451",
      header: "#21252b",
      hover: "#323842",
      muted: "#5c6370",
      success: "#98c379",
      warning: "#d19a66",
      error: "#e06c75",
      info: "#61afef",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#5c6773", fontStyle: "italic" },
        { token: "keyword", foreground: "#c372fc" },
        { token: "string", foreground: "#799965" },
        { token: "number", foreground: "#b88a5f" },
        { token: "operator", foreground: "#ff79c6" },
        { token: "function", foreground: "#528bff" },
        { token: "variable", foreground: "#d19a66" },
        { token: "type", foreground: "#ebcb8b" },
      ],
      colors: {
        "actionBar.toggledBackground": "#525761",
        "activityBar.background": "#23272e",
        "activityBar.foreground": "#d7dae0",
        "activityBarBadge.background": "#4d78cc",
        "activityBarBadge.foreground": "#f8fafd",
        "badge.background": "#23272e",
        "button.background": "#404754",
        "button.secondaryBackground": "#30333d",
        "button.secondaryForeground": "#c0bdbd",
        "checkbox.border": "#404754",
        "debugToolBar.background": "#1e2227",
        descriptionForeground: "#abb2bf",
        "diffEditor.insertedTextBackground": "#00809b33",
        "dropdown.background": "#1e2227",
        "dropdown.border": "#1e2227",
        "editor.background": "#23272e",
        "editor.findMatchBackground": "#d19a6644",
        "editor.findMatchBorder": "#ffffff5a",
        "editor.findMatchHighlightBackground": "#ffffff22",
        "editor.foreground": "#abb2bf",
        "editorBracketHighlight.foreground1": "#d19a66",
        "editorBracketHighlight.foreground2": "#c678dd",
        "editorBracketHighlight.foreground3": "#56b6c2",
        "editorHoverWidget.highlightForeground": "#61afef",
        "editorInlayHint.foreground": "#abb2bf",
        "editorInlayHint.background": "#2c313c",
        "editor.lineHighlightBackground": "#2c313c",
        "editorLineNumber.activeForeground": "#abb2bf",
        "editorGutter.addedBackground": "#109868",
        "editorGutter.deletedBackground": "#9A353D",
        "editorGutter.modifiedBackground": "#948B60",
        "editorOverviewRuler.addedBackground": "#109868",
        "editorOverviewRuler.deletedBackground": "#9A353D",
        "editorOverviewRuler.modifiedBackground": "#948B60",
        "editor.selectionBackground": "#67769660",
        "editor.selectionHighlightBackground": "#ffd33d44",
        "editor.selectionHighlightBorder": "#dddddd",
        "editor.wordHighlightBackground": "#d2e0ff2f",
        "editor.wordHighlightBorder": "#7f848e",
        "editor.wordHighlightStrongBackground": "#abb2bf26",
        "editor.wordHighlightStrongBorder": "#7f848e",
        "editorBracketMatch.background": "#515a6b",
        "editorBracketMatch.border": "#515a6b",
        "editorCursor.background": "#ffffffc9",
        "editorCursor.foreground": "#528bff",
        "editorError.foreground": "#c24038",
        "editorGroup.background": "#181a1f",
        "editorGroup.border": "#181a1f",
        "editorGroupHeader.tabsBackground": "#1e2227",
        "editorHoverWidget.background": "#1e2227",
        "editorHoverWidget.border": "#181a1f",
        "editorIndentGuide.activeBackground1": "#c8c8c859",
        "editorIndentGuide.background1": "#3b4048",
        "editorLineNumber.foreground": "#495162",
        "editorMarkerNavigation.background": "#1e2227",
        "editorRuler.foreground": "#abb2bf26",
        "editorSuggestWidget.background": "#1e2227",
        "editorSuggestWidget.border": "#181a1f",
        "editorSuggestWidget.selectedBackground": "#2c313a",
        "editorWarning.foreground": "#d19a66",
        "editorWhitespace.foreground": "#ffffff1d",
        "editorWidget.background": "#1e2227",
        focusBorder: "#3e4452",
        "gitDecoration.ignoredResourceForeground": "#636b78",
        "input.background": "#1d1f23",
        "input.foreground": "#abb2bf",
        "list.activeSelectionBackground": "#2c313a",
        "list.activeSelectionForeground": "#d7dae0",
        "list.focusBackground": "#323842",
        "list.focusForeground": "#f0f0f0",
        "list.highlightForeground": "#ecebeb",
        "list.hoverBackground": "#2c313a",
        "list.hoverForeground": "#abb2bf",
        "list.inactiveSelectionBackground": "#323842",
        "list.inactiveSelectionForeground": "#d7dae0",
        "list.warningForeground": "#d19a66",
        "menu.foreground": "#abb2bf",
        "menu.separatorBackground": "#343a45",
        "minimapGutter.addedBackground": "#109868",
        "minimapGutter.deletedBackground": "#9A353D",
        "minimapGutter.modifiedBackground": "#948B60",
        "panel.border": "#3e4452",
        "panelSectionHeader.background": "#1e2227",
        "peekViewEditor.background": "#1b1d23",
        "peekViewEditor.matchHighlightBackground": "#29244b",
        "peekViewResult.background": "#22262b",
        "scrollbar.shadow": "#23252c",
        "scrollbarSlider.activeBackground": "#747d9180",
        "scrollbarSlider.background": "#4e566660",
        "scrollbarSlider.hoverBackground": "#5a637580",
        "settings.focusedRowBackground": "#23272e",
        "settings.headerForeground": "#fff",
        "sideBar.background": "#1e2227",
        "sideBar.foreground": "#abb2bf",
        "sideBarSectionHeader.background": "#23272e",
        "sideBarSectionHeader.foreground": "#abb2bf",
        "statusBar.background": "#1e2227",
        "statusBar.debuggingBackground": "#cc6633",
        "statusBar.debuggingBorder": "#ff000000",
        "statusBar.debuggingForeground": "#ffffff",
        "statusBar.foreground": "#9da5b4",
        "statusBar.noFolderBackground": "#1e2227",
        "statusBarItem.remoteBackground": "#4d78cc",
        "statusBarItem.remoteForeground": "#f8fafd",
        "tab.activeBackground": "#23272e",
        "tab.activeBorder": "#b4b4b4",
        "tab.activeForeground": "#dcdcdc",
        "tab.border": "#181a1f",
        "tab.hoverBackground": "#323842",
        "tab.inactiveBackground": "#1e2227",
        "textBlockQuote.background": "#2e3440",
        "textBlockQuote.border": "#4b5362",
        "textLink.foreground": "#61afef",
        "textPreformat.foreground": "#d19a66",
        "titleBar.activeBackground": "#23272e",
        "titleBar.activeForeground": "#9da5b4",
        "titleBar.inactiveBackground": "#23272e",
        "titleBar.inactiveForeground": "#6b717d",
        "tree.indentGuidesStroke": "#ffffff1d",
        "walkThrough.embeddedEditorBackground": "#2e3440",
        "welcomePage.buttonHoverBackground": "#404754",
      },
    },
  },
  vsDark: {
    name: "VS Dark",
    value: "vs-dark",
    ui: {
      background: "#1e1e1e",
      foreground: "#d4d4d4",
      border: "#404040",
      accent: "#007acc",
      selection: "#264f78",
      header: "#252526",
      hover: "#2a2d2e",
      muted: "#656565",
      success: "#89d185",
      warning: "#cca700",
      error: "#f48771",
      info: "#75beff",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#5c6773",
        "editorCursor.foreground": "#ffffff",
        "editor.selectionBackground": "#264F78",
        "editor.wordHighlightBackground": "#264F78",
        "editorIndentGuide.background": "#264F78",
        "editorBracketMatch.background": "#264F78",
        "editorBracketMatch.border": "#264F78",
        "editor.lineHighlightBackground": "#2A2D2E",
        "editor.lineHighlightBorder": "#2A2D2E",
        "editor.selectionHighlightBackground": "#264F78",
      },
    },
  },
  // light: {
  //   name: "Light",
  //   value: "vs-light",
  //   ui: {
  //     background: "#ffffff",
  //     foreground: "#0a0a0a",
  //     border: "#e5e5e5",
  //     accent: "#0000ff",
  //     selection: "#add6ff",
  //     header: "#fafafa",
  //     hover: "#f0f0f0",
  //     muted: "#f5f5f5",
  //     success: "#388a34",
  //     warning: "#bf8803",
  //     error: "#ef4444",
  //     info: "#1a85ff",
  //   },
  //   monaco: {
  //     base: "vs",
  //     inherit: true,
  //     rules: [],
  //     colors: {
  //       "editor.lineHighlightBackground": "#F0F0F0",
  //       "editor.lineHighlightBorder": "#F0F0F0",
  //     },
  //   },
  // },
  solarizedDark: {
    name: "Solarized Dark",
    value: "solarizedDark",
    ui: {
      background: "#002b36",
      foreground: "#839496",
      border: "#073642",
      accent: "#268bd2",
      selection: "#073642",
      header: "#002b36",
      hover: "#586e75",
      muted: "#657b83",
      success: "#859900",
      warning: "#b58900",
      error: "#dc322f",
      info: "#268bd2",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "586e75", fontStyle: "italic" },
        { token: "keyword", foreground: "859900" },
        { token: "string", foreground: "2aa198" },
        { token: "number", foreground: "d33682" },
        { token: "operator", foreground: "6c71c4" },
        { token: "function", foreground: "b58900" },
        { token: "variable", foreground: "cb4b16" },
        { token: "type", foreground: "93a1a1" },
      ],
      colors: {
        "editor.background": "#002b36",
        "editor.foreground": "#839496",
        "editorLineNumber.foreground": "#586e75",
        "editorCursor.foreground": "#268bd2",
        "editor.selectionBackground": "#073642",
        "editor.wordHighlightBackground": "#073642",
        "editorIndentGuide.background": "#586e75",
        "editorBracketMatch.background": "#073642",
        "editorBracketMatch.border": "#268bd2",
        "editor.lineHighlightBackground": "#073642",
        "editor.lineHighlightBorder": "#073642",
      },
    },
  },
  dracula: {
    name: "Dracula",
    value: "dracula",
    ui: {
      background: "#282a36",
      foreground: "#F8F8F2",
      border: "#44475a",
      accent: "#BD93F9",
      selection: "#44475a",
      header: "#282a36",
      hover: "#21222C",
      muted: "#6272A4",
      success: "#50fa7b",
      warning: "#f1fa8c",
      error: "#FF5555",
      info: "#8be9fd",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#6272A4", fontStyle: "italic" },
        { token: "keyword", foreground: "#ff79c6" },
        { token: "string", foreground: "#f1fa8c" },
        { token: "number", foreground: "#bd93f9" },
        { token: "operator", foreground: "#ffb86c", background: "ffb86c" },
        { token: "function", foreground: "#8be9fd", background: "8be9fd" },
        { token: "variable", foreground: "#50fa7b" },
        { token: "type", foreground: "#50fa7b" },
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editorLineNumber.foreground": "#6272a4",
        "editorCursor.foreground": "#ff79c6",
        "editor.selectionBackground": "#44475a",
        "editor.wordHighlightBackground": "#44475a",
        "editorIndentGuide.background": "#44475a",
        "editorBracketMatch.background": "#44475a",
        "editorBracketMatch.border": "#50fa7b",
        "editor.lineHighlightBackground": "#44475a",
        "editor.lineHighlightBorder": "#44475a",
      },
    },
  },
  nord: {
    name: "Nord",
    value: "nord",
    ui: {
      background: "#2e3440",
      foreground: "#d8dee9",
      border: "#4c566a",
      accent: "#88c0d0",
      selection: "#4c566a",
      header: "#2e3440",
      hover: "#434c5e",
      muted: "#616e88",
      success: "#a3be8c",
      warning: "#ebcb8b",
      error: "#bf616a",
      info: "#81a1c1",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "616e88", fontStyle: "italic" },
        { token: "keyword", foreground: "81a1c1" },
        { token: "string", foreground: "a3be8c" },
        { token: "number", foreground: "b48ead" },
        { token: "operator", foreground: "88c0d0" },
        { token: "function", foreground: "8fbcbb" },
        { token: "variable", foreground: "d08770" },
        { token: "type", foreground: "ebcb8b" },
      ],
      colors: {
        "editor.background": "#2e3440",
        "editor.foreground": "#d8dee9",
        "editorLineNumber.foreground": "#4c566a",
        "editorCursor.foreground": "#88c0d0",
        "editor.selectionBackground": "#4c566a",
        "editor.wordHighlightBackground": "#434c5e",
        "editorIndentGuide.background": "#4c566a",
        "editorBracketMatch.background": "#4c566a",
        "editorBracketMatch.border": "#88c0d0",
        "editor.lineHighlightBackground": "#434c5e",
        "editor.lineHighlightBorder": "#434c5e",
      },
    },
  },
  vercel: {
    name: "Vercel",
    value: "vercel",
    ui: {
      background: "#000000",
      foreground: "#d1d5db",
      border: "#2d2d2d",
      accent: "#0070f3",
      selection: "#333333",
      header: "#000000",
      hover: "#1f1f1f",
      muted: "#828282",
      success: "#27c93f",
      warning: "#f7b500",
      error: "#f75252",
      info: "#3694ff",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#d1d5db",
        "editor.lineHighlightBackground": "#1a1a1a",
        "editor.lineHighlightBorder": "#1a1a1a",
        "editor.selectionBackground": "#333333",
        "editor.wordHighlightBackground": "#1f2937",
        "editorIndentGuide.background": "#2d2d2d",
        "editorBracketMatch.background": "#333333",
        "editorBracketMatch.border": "#4b5563",
        "editorLineNumber.foreground": "#4b5563",
        "editorCursor.foreground": "#0070f3",
      },
      rules: [
        { token: "comment", foreground: "#6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "#ff4c8d" },
        { token: "string", foreground: "#10b981" },
        { token: "number", foreground: "#fffff4" },
        { token: "operator", foreground: "#ff4c8d" },
        { token: "function", foreground: "#c372fc" },
        { token: "variable", foreground: "#ff4c8d" },
        { token: "type", foreground: "#47a8ff" },
      ],
    },
  },
  tokyoNight: {
    name: "Tokyo Night",
    value: "tokyoNight",
    ui: {
      background: "#1a1b26",
      foreground: "#c0caf5",
      border: "#24283b",
      accent: "#7aa2f7",
      selection: "#33467c",
      header: "#1f2335",
      hover: "#2c3041",
      muted: "#565f89",
      success: "#9ece6a",
      warning: "#e0af68",
      error: "#f7768e",
      info: "#7dcfff",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "565f89", fontStyle: "italic" },
        { token: "keyword", foreground: "bb9af7" },
        { token: "string", foreground: "9ece6a" },
        { token: "number", foreground: "ff9e64" },
        { token: "operator", foreground: "7aa2f7" },
        { token: "function", foreground: "7dcfff" },
        { token: "variable", foreground: "f7768e" },
        { token: "type", foreground: "e0af68" },
      ],
      colors: {
        "editor.background": "#1a1b26",
        "editor.foreground": "#c0caf5",
        "editorLineNumber.foreground": "#565f89",
        "editorCursor.foreground": "#7aa2f7",
        "editor.selectionBackground": "#33467c",
        "editor.wordHighlightBackground": "#2c3041",
        "editorIndentGuide.background": "#24283b",
        "editorBracketMatch.background": "#3b4261",
        "editorBracketMatch.border": "#3b4261",
        "editor.lineHighlightBackground": "#292e42",
        "editor.lineHighlightBorder": "#292e42",
      },
    },
  },
  ayuMirage: {
    name: "Ayu Mirage",
    value: "ayuMirage",
    ui: {
      background: "#1f2430",
      foreground: "#cbccc6",
      border: "#3a3f4b",
      accent: "#39bae6",
      selection: "#273747",
      header: "#1f2430",
      hover: "#2c313c",
      muted: "#707a8a",
      success: "#a1cd5e",
      warning: "#ffcc66",
      error: "#f07178",
      info: "#5ccfe6",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5c6773", fontStyle: "italic" },
        { token: "keyword", foreground: "ffa759" },
        { token: "string", foreground: "bae67e" },
        { token: "number", foreground: "ffd580" },
        { token: "operator", foreground: "5ccfe6" },
        { token: "function", foreground: "73d0ff" },
        { token: "variable", foreground: "ff3333" },
        { token: "type", foreground: "ffc44c" },
      ],
      colors: {
        "editor.background": "#1f2430",
        "editor.foreground": "#cbccc6",
        "editorLineNumber.foreground": "#5c6773",
        "editorCursor.foreground": "#39bae6",
        "editor.selectionBackground": "#273747",
        "editor.wordHighlightBackground": "#3a3f4b",
        "editorIndentGuide.background": "#3a3f4b",
        "editorBracketMatch.background": "#3a3f4b",
        "editorBracketMatch.border": "#3a3f4b",
        "editor.lineHighlightBackground": "#242936",
        "editor.lineHighlightBorder": "#242936",
      },
    },
  },
  candy: {
    name: "Candy",
    value: "candy",
    ui: {
      background: "#1e1e2e",
      foreground: "#d9e0ee",
      border: "#302d41",
      accent: "#f5c2e7",
      selection: "#45475a",
      header: "#24273a",
      hover: "#393552",
      muted: "#6e6a86",
      success: "#a6e3a1",
      warning: "#f9e2af",
      error: "#f38ba8",
      info: "#89b4fa",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6e6a86", fontStyle: "italic" },
        { token: "keyword", foreground: "cba6f7" },
        { token: "string", foreground: "a6e3a1" },
        { token: "number", foreground: "fab387" },
        { token: "operator", foreground: "f5c2e7" },
        { token: "function", foreground: "89b4fa" },
        { token: "variable", foreground: "f38ba8" },
        { token: "type", foreground: "f9e2af" },
      ],
      colors: {
        "editor.background": "#1e1e2e",
        "editor.foreground": "#d9e0ee",
        "editorLineNumber.foreground": "#6e6a86",
        "editorCursor.foreground": "#f5c2e7",
        "editor.selectionBackground": "#45475a",
        "editor.wordHighlightBackground": "#393552",
        "editorIndentGuide.background": "#302d41",
        "editorBracketMatch.background": "#45475a",
        "editorBracketMatch.border": "#6e6a86",
        "editor.lineHighlightBackground": "#313244",
        "editor.lineHighlightBorder": "#313244",
      },
    },
  },
  suparbase: {
    name: "Suparbase",
    value: "suparbase",
    ui: {
      background: "#171717",
      foreground: "#9d9d9d",
      border: "#262c29",
      accent: "#3dcd8c",
      selection: "#9d9d9d22",
      header: "#171717",
      hover: "#454545",
      muted: "#505050",
      success: "#3dcd8c",
      warning: "#f9e2af",
      error: "#f38ba8",
      info: "#89b4fa",
    },

    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "9d9d9d", fontStyle: "italic" },
        { token: "keyword", foreground: "4af8aa" },
        { token: "string", foreground: "ffffff80" },
        { token: "number", foreground: "ffffff" },
        { token: "operator", foreground: "ff4c8d" },
        { token: "function", foreground: "c372fc" },
        { token: "variable", foreground: "c372fc" },
        { token: "type", foreground: "3dcd8c" },
        { token: "constant", foreground: "a855f7" },
      ],
      colors: {
        "editor.background": "#171717",
        "editor.foreground": "#9d9d9d",
        "editorLineNumber.foreground": "#4b5563",
        "editorCursor.foreground": "#00b4f7",
        "editor.selectionBackground": "#333333",
        "editor.wordHighlightBackground": "#1f2937",
        "editorIndentGuide.background": "#2d2d2d",
        "editorBracketMatch.background": "#333333",
        "editorBracketMatch.border": "#4b5563",
        "editor.lineHighlightBackground": "#1a1a1a",
        "editor.lineHighlightBorder": "#1a1a1a",
      },
    },
  },

  midudev: {
    name: "midu.dev",
    value: "midudev",
    ui: {
      background: "#0b1422", // Fondo oscuro para el editor
      foreground: "#D4D4D4", // Color principal del texto
      border: "#3C3C3C", // Bordes de paneles o secciones
      accent: "#569CD6", // Color de acento, similar al resaltado de variables o palabras clave
      selection: "#264F78", // Fondo de selección de texto
      header: "#0b1422", // Cabecera o títulos
      hover: "#264F78", // Color de fondo cuando se pasa el cursor sobre elementos
      muted: "#808080", // Texto o elementos menos destacados
      success: "#1E90FF", // Indicadores de éxito o confirmación
      warning: "#FF9877", // Indicadores de advertencia
      error: "#F44336", // Indicadores de error
      info: "#2196F3", // Indicadores de información adicional
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#96adba", fontStyle: "italic" }, // Color para comentarios
        { token: "keyword", foreground: "#3fa2e5" }, // Palabras clave como `let`, `const`
        { token: "string", foreground: "#d6e6e0" }, // Color para cadenas de texto
        { token: "number", foreground: "#43aef5" }, // Color para números
        { token: "variable", foreground: "#aec8dd" }, // Color para variables
        { token: "type", foreground: "#42b3ff" }, // Tipos de datos
        { token: "function", foreground: "#aec8dd" }, // Color para funciones
        { token: "constant", foreground: "#aec8dd" }, // Constantes
        { token: "operator", foreground: "#8dc6e6" }, // Operadores como `??`, `=`
      ],
      colors: {
        "editor.background": "#0b1422", // Fondo del editor
        "editor.foreground": "#cbe9ff", // Color principal del texto en el editor
        "editorCursor.foreground": "#FFFFFF", // Color del cursor
        "editorLineNumber.foreground": "#858585", // Color de los números de línea
        "editor.selectionBackground": "#264F78", // Fondo para el texto seleccionado
        "editor.inactiveSelectionBackground": "#3A3D41", // Fondo de selección inactiva
        "editor.lineHighlightBackground": "#2A2D2E", // Resaltado de la línea actual
        "editor.findMatchHighlightBackground": "#515C6A", // Resaltado de coincidencias de búsqueda
        "editorHoverWidget.background": "#252526", // Fondo de los widgets emergentes
        "editorHoverWidget.border": "#454545", // Borde de los widgets emergentes
        "editorSuggestWidget.background": "#252526", // Fondo del widget de sugerencias
        "editorSuggestWidget.border": "#454545", // Borde del widget de sugerencias
        "editorSuggestWidget.foreground": "#D4D4D4", // Color del texto en el widget de sugerencias
        "editorSuggestWidget.highlightForeground": "#569CD6", // Color de texto resaltado en sugerencias
      },
    },
  },
  synthwave84Theme: {
    name: "SynthWave '84",
    value: "synthwave84",
    ui: {
      background: "#2b213a",
      foreground: "#ffffff",
      border: "#6b4c7a",
      accent: "#ff6ac1",
      selection: "#6b4c7a",
      header: "#2b213a",
      hover: "#3b3052",
      muted: "#8e7c9a",
      success: "#3ad900",
      warning: "#ff9e64",
      error: "#f92aad",
      info: "#00f6ff",
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "operator", foreground: "ffb86c" },
        { token: "function", foreground: "8be9fd" },
        { token: "variable", foreground: "50fa7b" },
        { token: "type", foreground: "50fa7b" },
      ],
      colors: {
        "editor.background": "#2b213a",
        "editor.foreground": "#ffffff",
        "editorLineNumber.foreground": "#6272a4",
        "editorCursor.foreground": "#ff79c6",
        "editor.selectionBackground": "#44475a",
        "editor.wordHighlightBackground": "#44475a",
        "editorIndentGuide.background": "#44475a",
        "editorBracketMatch.background": "#44475a",
        "editorBracketMatch.border": "#50fa7b",
        "editor.lineHighlightBackground": "#44475a",
        "editor.lineHighlightBorder": "#44475a",
      },
    },
  },

  monokaiPro: {
    name: "Monokai Pro",
    value: "monokai-pro",
    ui: {
      background: "#272822", // Fondo principal
      foreground: "#F8F8F2", // Texto principal
      border: "#3E3D32", // Bordes
      accent: "#A6E22E", // Color de acento (verde)
      selection: "#49483E", // Fondo de selección
      header: "#2C2D27", // Fondo del encabezado
      hover: "#3E3E3E", // Fondo al pasar el cursor
      muted: "#75715E", // Texto deshabilitado
      success: "#A6E22E", // Verde para éxito
      warning: "#E6DB74", // Amarillo para advertencias
      error: "#F92672", // Rosa para errores
      info: "#66D9EF", // Azul claro para información
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "F8F8F2", background: "272822" }, // Texto general
        { token: "comment", foreground: "75715E", fontStyle: "italic" }, // Comentarios
        { token: "string", foreground: "E6DB74" }, // Cadenas
        { token: "keyword", foreground: "F92672", fontStyle: "bold" }, // Palabras clave
        { token: "number", foreground: "AE81FF" }, // Números
        { token: "operator", foreground: "F8F8F2" }, // Operadores
        { token: "identifier", foreground: "A6E22E" }, // Identificadores
        { token: "function", foreground: "66D9EF" }, // Funciones
        { token: "type", foreground: "FD971F" }, // Tipos
      ],
      colors: {
        "editor.background": "#272822", // Fondo del editor
        "editor.foreground": "#F8F8F2", // Texto principal
        "editorLineNumber.foreground": "#75715E", // Números de línea
        "editorCursor.foreground": "#F8F8F0", // Cursor
        "editor.selectionBackground": "#49483E", // Selección
        "editor.inactiveSelectionBackground": "#3E3D32", // Selección inactiva
        "editor.lineHighlightBackground": "#3E3D32", // Línea actual
        "editorBracketMatch.background": "#49483E", // Resaltado de corchetes
        "editorBracketMatch.border": "#A6E22E", // Borde de corchetes
      },
    },
  },
  ayuDark: {
    name: "Ayu Dark",
    value: "ayu-dark",
    ui: {
      background: "#0F1419", // Fondo principal oscuro
      foreground: "#E6E1CF", // Texto principal
      border: "#1E253088", // Sin bordes visibles
      accent: "#FFCC66", // Color de acento (amarillo suave)
      selection: "#1E2530", // Fondo de selección
      header: "#13172A", // Fondo del encabezado
      hover: "#1A1F28", // Fondo al pasar el cursor
      muted: "#5C6773", // Texto deshabilitado o atenuado
      success: "#aad94c", // Verde para éxito
      warning: "#FFD580", // Amarillo para advertencias
      error: "#F07178", // Rojo para errores
      info: "#8CCFFF", // Azul claro para información
    },
    monaco: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "E6E1CF", background: "0F1419" }, // Texto general
        { token: "comment", foreground: "5C6773", fontStyle: "italic" }, // Comentarios
        { token: "string", foreground: "95E6CB" }, // Cadenas
        { token: "keyword", foreground: "F07178", fontStyle: "bold" }, // Palabras clave
        { token: "number", foreground: "FFD580" }, // Números
        { token: "operator", foreground: "E6E1CF" }, // Operadores
        { token: "identifier", foreground: "FFCC66" }, // Identificadores
        { token: "function", foreground: "FFD580" }, // Funciones
        { token: "type", foreground: "73D0FF" }, // Tipos
      ],
      colors: {
        "editor.background": "#0F1419", // Fondo del editor
        "editor.foreground": "#E6E1CF", // Texto principal
        "editorLineNumber.foreground": "#5C6773", // Números de línea
        "editorCursor.foreground": "#FFCC66", // Cursor
        "editor.selectionBackground": "#1E2530", // Selección
        "editor.inactiveSelectionBackground": "#131720", // Selección inactiva
        "editor.lineHighlightBackground": "#131720", // Línea actual
        "editorBracketMatch.background": "#1E2530", // Resaltado de corchetes
        "editorBracketMatch.border": "#FFD580", // Borde de corchetes
      },
    },
  },
  adventjs: {
    name: "adventjs",
    value: "dark",
    ui: {
      background: "#071e22", // Fondo oscuro profundo
      foreground: "#e0e5e8", // Texto principal ligeramente más claro
      border: "#2a3d40", // Bordes oscuros más suaves y sutiles
      accent: "#5e8b7e", // Verde apagado para un mejor contraste en énfasis
      selection: "#1c3b44", // Selección en un azul-verdoso sutil
      header: "#0b2d35", // Encabezados ligeramente diferenciados del fondo
      hover: "#17845416", // Hover en verde más vibrante pero no saturado
      muted: "#bfc5c2", // Comentarios en gris-verde apagado
      success: "#66cc33", // Verde brillante para "success" (sin cambios)
      warning: "#e3c947", // Amarillo dorado más suave para advertencias
      error: "#d65a58", // Rojo coral más balanceado para errores
      info: "#47a2b6", // Azul cian más suave para "info"
    },
    monaco: {
      base: "vs-dark", // Hereda el tema oscuro
      inherit: true,
      rules: [
        { token: "type", foreground: "a7c957" },
        { foreground: "ffffff", background: "434242", token: "text" },
        { foreground: "ffffff", background: "000000", token: "source" },
        { foreground: "#858779", token: "comment" },
        { foreground: "#f2e8cf", token: "constant" },
        { foreground: "#6a994e", token: "keyword" },
        { foreground: "#66cc33", token: "string" },
        { foreground: "#aaaaaa", token: "string constant.character.escape" },
        { fontStyle: "italic", token: "variable.parameter" },
        { fontStyle: "underline", token: "entity.name.type" },
        { foreground: "#6a994e", token: "support.function" },
      ],
      colors: {
        "editor.foreground": "#fffaca", // Color principal del texto
        "editor.background": "#071e22", // Fondo del editor
        "editor.selectionBackground": "#F8B22940", // Selección de texto
        "editor.lineHighlightBackground": "#fafafa10", // Línea activa
        "editorCursor.foreground": "#FFFFFF", // Cursor blanco
        "editorWhitespace.foreground": "#fafafa60", // Espacios vacíos
        "editorIndentGuide.activeBackground": "#6a994e", // Guía de indentación activa
        "editorIndentGuide.background": "#434242", // Guía de indentación
      },
    },
  },
};
