import type { lineRendererEditor, Radius, Tab } from "@/features/editor/types";
import type { EditorSettingConfig } from "./types";

export const DEFAULT_CODE = `
/*
 * 🌟 Bienvenido a RunTS 🚀
 *
 * Ejecuta TypeScript y JavaScript fácilmente.
 *
 * Características:
 * - Gratis y Open Source. 🆓
 * - Themes. 🎨
 * - auto Refresh. 🔄
 * - Chatbot en desarrollo (Google, OpenAI, Claude).
 *
 * Contribuye al proyecto en GitHub:
 * https://github.com/acbcdev/RunTS
 */

/*
 * Ejemplo de código:
 */
'¡Hola, RunTS! 🌟';

[1, 2, 3].map(x => x * 2); // Duplica los números

475 + 465
/*
 * 💡 Tip:
 * Usa tu API Key para probar el chatbot.
 *
 * ¡Disfruta creando con RunTS! 🎉
 */

`;

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

export const INITIAL_TABS: Tab[] = [
	{
		id: "1",
		name: "main.ts",
		language: "typescript",
		code: DEFAULT_CODE,
		log: "",
		editing: false,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
];

export const TAB_SIZES = [2, 4, 8];

export const PRINT_WIDTHS = [80, 100, 120];

export const AUTO_INDENT_OPTIONS = [
	{ value: "none", label: "None" },
	{ value: "keep", label: "Keep" },
	{ value: "brackets", label: "Brackets" },
	{ value: "advanced", label: "Advanced" },
	{ value: "full", label: "Full" },
] as const;
