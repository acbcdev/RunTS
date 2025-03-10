import type { Theme } from "@/types/editor";
import { createTheme } from "@/themes/lib";

export const themes: Record<string, Theme> = {
	oneDark: createTheme({
		name: "One Dark",
		ui: {
			background: "#282c34",
			foreground: "#abb2bf",
			border: "#3e4451",
			accent: "#c372fc",
			selection: "#3e4451",
			header: "#21252b",
			hover: "#323842",
			muted: "#5c6370",
			success: "#a3be8c",
			warning: "#ffcc66",
			error: "#f07178",
			info: "#5ccfe6",
		},
		monaco: {
			comment: "#5c6773",
			keyword: "#c371db",
			string: "#769463",
			number: "#b88a5f",
			operator: "#8dc6e6",
			function: "#8fbcbb",
			variable: "#d08770",
			type: "#ebcb8b",
			BracketHighlight1: "#d1985e",
			BracketHighlight2: "#c678c7",
			BracketHighlight3: "#54b6c2",
		},
	}),
	vsDark: createTheme({
		name: "VS Dark",
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
			comment: "#5c6773",
			keyword: "#007acc",
			string: "#89d185",
			number: "#b5cea8",
			operator: "#d4d4d4",
			function: "#d4d4d4",
			variable: "#d4d4d4",
			type: "#569cd6",
			BracketHighlight1: "#d1985e",
			BracketHighlight2: "#c678c7",
			BracketHighlight3: "#54b6c2",
		},
	}),

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
	solarizedDark: createTheme({
		name: "Solarized Dark",
		ui: {
			background: "#002b36",
			foreground: "#83a4a6",
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
			comment: "#657b83",
			keyword: "#268bd2",
			string: "#859900",
			number: "#2aa198",
			operator: "#6c71c4",
			function: "#b58900",
			variable: "#cb4b16",
			type: "#93a1a1",
			BracketHighlight1: "#d1985e",
			BracketHighlight2: "#c678c7",
			BracketHighlight3: "#54b6c2",
		},
	}),

	dracula: createTheme({
		name: "Dracula",
		ui: {
			background: "#282a36",
			foreground: "#f8f8f2",
			border: "#44475a",
			accent: "#bd93f9",
			selection: "#44475a",
			header: "#282a36",
			hover: "#21222c",
			muted: "#6272a4",
			success: "#50fa7b",
			warning: "#f1fa8c",
			error: "#ff5555",
			info: "#8be9fd",
		},
		monaco: {
			comment: "#6272a4",
			keyword: "#ff79c6",
			string: "#f1fa8c",
			number: "#bd93f9",
			operator: "#ffb86c",
			function: "#8be9fd",
			variable: "#50fa7b",
			type: "#50fa7b",
			BracketHighlight1: "#bd93f9",
			BracketHighlight2: "#ff79c6",
			BracketHighlight3: "#8be9fd",
		},
	}),

	nord: createTheme({
		name: "Nord",
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
			comment: "#616e88",
			keyword: "#81a1c1",
			string: "#a3be8c",
			number: "#b48ead",
			operator: "#88c0d0",
			function: "#8fbcbb",
			variable: "#d08770",
			type: "#ebcb8b",
			BracketHighlight1: "#b48ead",
			BracketHighlight2: "#a3be8c",
			BracketHighlight3: "#81a1c1",
		},
	}),
	vercel: createTheme({
		name: "Vercel",
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
			comment: "#6b7280",
			keyword: "#ff4c8d",
			string: "#10b981",
			number: "#fffff4",
			operator: "#ff4c8d",
			function: "#c372fc",
			variable: "#ff4c8d",
			type: "#47a8ff",
			BracketHighlight1: "#ff4c8d",
			BracketHighlight2: "#c372fc",
			BracketHighlight3: "#47a8ff",
		},
	}),
	githubDark: createTheme({
		name: "GitHub",
		ui: {
			background: "#0D1117",
			foreground: "#C9D1D9",
			border: "#21262D",
			accent: "#58A6FF",
			selection: "#3382FF",
			header: "#010409",
			hover: "#161B22",
			muted: "#8B949E",
			success: "#56D364",
			warning: "#E3B341",
			error: "#F85149",
			info: "#58A6FF",
		},
		monaco: {
			comment: "#8B949E",
			keyword: "#FF7B72",
			string: "#A5D6FF",
			number: "#FFBDAE",
			operator: "#79C0FF",
			function: "#58A6FF",
			variable: "#C9D1D9",
			type: "#A5D6FF",
			BracketHighlight1: "#FF7B72",
			BracketHighlight2: "#A5D6FF",
			BracketHighlight3: "#FFBDAE",
		},
	}),
	tokyoNight: createTheme({
		name: "Tokyo Night",
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
			comment: "#565f89",
			keyword: "#bb9af7",
			string: "#9ece6a",
			number: "#ff9e64",
			operator: "#7aa2f7",
			function: "#7dcfff",
			variable: "#f7768e",
			type: "#e0af68",
			BracketHighlight1: "#f7768e",
			BracketHighlight2: "#7dcfff",
			BracketHighlight3: "#e0af68",
		},
	}),
	ayuMirage: createTheme({
		name: "Ayu Mirage",
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
			comment: "#5c6773",
			keyword: "#ffa759",
			string: "#bae67e",
			number: "#ffd580",
			operator: "#5ccfe6",
			function: "#73d0ff",
			variable: "#ff3333",
			type: "#ffc44c",
			BracketHighlight1: "#73d0ff",
			BracketHighlight2: "#ffc44c",
			BracketHighlight3: "#a1cd5e",
		},
	}),
	ayuDark: createTheme({
		name: "Ayu Dark",
		ui: {
			background: "#0F1419", // Fondo principal oscuro
			foreground: "#E6E1CF", // Texto principal
			border: "#1E253088", // Sin bordes visibles
			accent: "#FFCC66", // Color de acento (amarillo suave)
			selection: "#1E2530", // Fondo de selección
			header: "#1A1F2A", // Fondo del encabezado oscuro
			hover: "#1A1F28", // Fondo al pasar el cursor
			muted: "#5C6773", // Texto deshabilitado o atenuado
			success: "#aad94c", // Verde para éxito
			warning: "#FFD580", // Amarillo para advertencias
			error: "#F07178", // Rojo para errores
			info: "#8CCFFF", // Azul claro para información
		},
		monaco: {
			comment: "#5C6773",
			keyword: "#F07178",
			string: "#95E6CB",
			number: "#FFD580",
			operator: "#E6E1CF",
			function: "#FFD580",
			variable: "#FFCC66",
			type: "#73D0FF",
			BracketHighlight1: "#95E6CB",
			BracketHighlight2: "#FFD580",
			BracketHighlight3: "#73D0FF",
		},
	}),
	candy: createTheme({
		name: "Candy",
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
			comment: "#6e6a86",
			keyword: "#cba6f7",
			string: "#a6e3a1",
			number: "#fab387",
			operator: "#f5c2e7",
			function: "#89b4fa",
			variable: "#f38ba8",
			type: "#f9e2af",
			BracketHighlight1: "#f38ba8",
			BracketHighlight2: "#89b4fa",
			BracketHighlight3: "#f9e2af",
		},
	}),

	suparbase: createTheme({
		name: "Suparbase",
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
			comment: "#9d9d9d",
			keyword: "#4af8aa",
			string: "#ffffff80",
			number: "#ffffff",
			operator: "#ff4c8d",
			function: "#c372fc",
			variable: "#c372fc",
			type: "#faca9e",
			BracketHighlight1: "#ff4c8d",
			BracketHighlight2: "#c372fc",
			BracketHighlight3: "#333333",
		},
	}),

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
	monokaiPro: createTheme({
		name: "Monokai Pro",
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
			comment: "#75715E",
			keyword: "#F92672",
			string: "#E6DB74",
			number: "#AE81FF",
			operator: "#F8F8F2",
			function: "#66D9EF",
			variable: "#A6E22E",
			type: "#FD971F",
			BracketHighlight1: "#A6E22E",
			BracketHighlight2: "#FD971F",
			BracketHighlight3: "#66D9EF",
		},
	}),
	midudev: createTheme({
		name: "Midu.dev",
		ui: {
			background: "#0a1220", // Fondo más profundo para mayor contraste
			foreground: "#E0E0E0", // Texto más claro para mayor legibilidad
			border: "#404040", // Bordes ligeramente más visibles
			accent: "#61AFEF", // Azul vibrante para un mejor contraste
			selection: "#3A5378", // Fondo de selección más definido
			header: "#0a1220", // Fondo de encabezados similar al de fondo
			hover: "#1F618D", // Azul más claro para hover
			muted: "#A0A0A0", // Texto menos destacado con mejor contraste
			success: "#20C20E", // Verde más vibrante para éxito
			warning: "#FFAA66", // Naranja más claro para advertencias
			error: "#FF5555", // Rojo más llamativo para errores
			info: "#42A5F5", // Azul más claro para información
		},
		monaco: {
			comment: "#A0BACC", // Azul grisáceo más sutil para comentarios
			keyword: "#41B3F9", // Azul más brillante para palabras clave
			string: "#c9d9d4", // Verde más vibrante para strings
			number: "#FFCC66", // Amarillo suave para números
			variable: "#ABB2BF", // Color más neutro para variables
			type: "#56B6C2", // Azul cian para tipos
			function: "#FFD700", // Amarillo dorado para funciones
			operator: "#C678DD", // Lila más distintivo para operadores
			BracketHighlight1: "#42b2fe",
			BracketHighlight2: "#42b2fe",
			BracketHighlight3: "#42b2fe",
		},
	}),
	marsCodes: createTheme({
		name: "Mars.Codes",
		ui: {
			background: "#15080a",
			foreground: "#e8d8c4",
			border: "#54342f",
			accent: "#e57441",
			selection: "#5d4b4d88",
			header: "#2d191b",
			hover: "#54342f",
			muted: "#c6a28c",
			warning: "#ed994d",
			error: "#d14d2a",
			success: "#d56b23",
			info: "#a67c62",
		},
		monaco: {
			comment: "#c6a28c",
			keyword: "#ed994d",
			string: "#d56b23",
			number: "#d14d2a",
			operator: "#e57441",
			function: "#d56b23",
			variable: "#e8d8c4",
			type: "#a67c62",
			BracketHighlight1: "#e57441",
			BracketHighlight2: "#a67c62",
			BracketHighlight3: "#d14d2a",
		},
	}),
	adventjs: createTheme({
		name: "adventJs",
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
			info: "#47a2b6", // Az
		},
		monaco: {
			type: "#a7c957",
			comment: "#858779",
			keyword: "#6a994e",
			string: "#66cc33",
			number: "#f2e8cf",
			operator: "#6a994e",
			function: "#6a994e",
			variable: "#aaaaaa",
			BracketHighlight1: "#f2e8cf",
			BracketHighlight3: "#66cc33",
			BracketHighlight2: "#6a994e",
		},
	}),
	shadesOfPurple: createTheme({
		name: "Shades of Purple",
		ui: {
			background: "#2D2B55",
			foreground: "#f5f9Ef",
			border: "#3E3D70",
			accent: "#fad000",
			selection: "#5A56A8",
			header: "#1E1E3F",
			hover: "#3B3172",
			muted: "#A599E9",
			success: "#72F1B8",
			warning: "#FFB454",
			error: "#FF2C70",
			info: "#9EFFFF",
		},
		monaco: {
			comment: "#B362FF",
			keyword: "#FF9D00",
			string: "#9EFFFF",
			number: "#FF628C",
			operator: "#C792EA",
			function: "#fb94ff",
			variable: "#FFFFFF",
			type: "#FFFFFF",
			BracketHighlight1: "#fad000",
			BracketHighlight2: "#9EFFFF",
			BracketHighlight3: "#fb94ff",
		},
	}),
	palenightTheme: createTheme({
		name: "Palenight Theme",
		ui: {
			background: "#292D3E",
			foreground: "#A6ACCD",
			border: "#383D52",
			accent: "#C792EA",
			selection: "#444267",
			header: "#1B1E2B",
			hover: "#3C435E",
			muted: "#676E95",
			success: "#C3E88D",
			warning: "#FFC777",
			error: "#F78C6C",
			info: "#89DDFF",
		},
		monaco: {
			comment: "#676E95",
			keyword: "#C792EA",
			string: "#C3E88D",
			number: "#F78C6C",
			operator: "#89DDFF",
			function: "#82AAFF",
			variable: "#A6ACCD",
			type: "#FFCB6B",
			BracketHighlight1: "#C792EA",
			BracketHighlight2: "#C3E88D",
			BracketHighlight3: "#F78C6C",
		},
	}),
	hackTheBox: createTheme({
		name: "Hack The Box",
		ui: {
			background: "#10141c",
			foreground: "#c9d1d9",
			border: "#2d2d2d",
			accent: "#9FEF00",
			selection: "#2c3543",
			header: "#10141c",
			hover: "#1f252f",
			muted: "#6b727f",
			success: "#21d19f",
			warning: "#f7b500",
			error: "#f75252",
			info: "#28a0f7",
		},
		monaco: {
			comment: "#6b727f",
			keyword: "#f5ba21",
			string: "#2de0a7",
			number: "#f78c6c",
			operator: "#b8bbc1",
			function: "#2de0a7",
			variable: "#c9d1d9",
			type: "#49daf4",
			BracketHighlight3: "#2de0a7",
			BracketHighlight2: "#49daf4",
			BracketHighlight1: "#9fef00",
		},
	}),
};
