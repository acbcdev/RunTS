import { REFRESH_TIMES, RENDER_LINES } from "@/consts/config";
import type {
	ApparenceStoreActions,
	ApparenceStoreStates,
} from "@/store/apparence";
import type { ConfigEditorState } from "@/store/config";
import { themes } from "@/themes";
import type { CommandItem } from "@/types/command";
import { Brush, Hash, Timer } from "lucide-react";

// Tipos genéricos para los generadores de submenús
export type SubmenuContext = Record<string, unknown>;

export type SubmenuActions = Record<string, (...args: never[]) => void>;

export type SubmenuGenerator<
	TContext = SubmenuContext,
	TActions = SubmenuActions,
> = (context: TContext, actions: TActions) => CommandItem[];

// Tipos específicos para configuración
export interface ConfigActions extends SubmenuActions {
	setConfigValue: <K extends keyof ConfigEditorState>(
		key: K,
		value: ConfigEditorState[K],
	) => void;
}

// Tipos específicos para generadores
type ConfigSubmenuGenerator = SubmenuGenerator<
	ConfigEditorState,
	ConfigActions
>;
type ApparenceSubmenuGenerator = SubmenuGenerator<
	ApparenceStoreStates,
	ApparenceStoreActions["setOption"]
>;

// Registro de generadores por categoría
export interface SubmenuRegistry {
	config: Record<string, ConfigSubmenuGenerator>;
	// Aquí se pueden agregar más categorías como:
	// tabs: Record<string, TabSubmenuGenerator>;
	// ai: Record<string, AISubmenuGenerator>;
	// etc.
}

// Generadores específicos de configuración
const configSubmenuGenerators: Record<string, ConfigSubmenuGenerator> = {
	"refresh-time": (config, { setConfigValue }) =>
		REFRESH_TIMES.map((time) => ({
			id: `refresh-time-${time.value}`,
			title: time.time,
			description:
				time.value === config.refreshTime
					? `Current: ${time.time}`
					: `Set refresh time to ${time.time}`,
			icon: Timer,
			category: "config" as const,
			parentId: "refresh-time",
			keywords: [time.time, `${time.value}ms`, "time", "tiempo", "refresh"],
			action: () => setConfigValue("refreshTime", time.value),
			isSelected: time.value === config.refreshTime,
		})),

	"line-renderer": (config, { setConfigValue }) =>
		RENDER_LINES.map((mode) => ({
			id: `render-${mode}`,
			title:
				mode === "line"
					? "Line Mode"
					: mode === "gutter"
						? "Gutter Mode"
						: mode === "all"
							? "All Mode"
							: "None Mode",
			description:
				mode === config.lineRenderer
					? `Current: ${mode} rendering`
					: `Switch to ${mode} rendering`,
			icon: Hash,
			category: "config" as const,
			parentId: "line-renderer",
			keywords: [mode, "render", "renderizado", "mode", "modo"],
			action: () => setConfigValue("lineRenderer", mode),
			preventDefault: true,
			isSelected: mode === config.lineRenderer,
		})),
};

// Generadores específicos de apariencia
const apparenceSubmenuGenerators: Record<string, ApparenceSubmenuGenerator> = {
	"change-theme": (apparence, actions) => {
		return Object.entries(themes).map(([themeName, value]) => ({
			id: `theme-${String(themeName)}`,
			title: value.name,
			description: `Switch to ${value.name} theme`,
			icon: Brush,
			category: "apparence" as const,
			parentId: "change-theme",
			keywords: [
				String(themeName),
				"theme",
				"color",
				"appearance",
				"config",
				"settings",
			],
			action: () => actions("theme", themeName),
			isSelected: themeName === apparence.theme,
			preventDefault: true,
		}));
	},
};

// Registro de generadores por categoría
export interface SubmenuRegistry {
	config: Record<string, ConfigSubmenuGenerator>;
	apparence: Record<string, ApparenceSubmenuGenerator>;
	// Aquí se pueden agregar más categorías como:
	// tabs: Record<string, TabSubmenuGenerator>;
	// ai: Record<string, AISubmenuGenerator>;
	// etc.
}

// Registro principal de generadores
export const submenuRegistry: SubmenuRegistry = {
	config: configSubmenuGenerators,
	apparence: apparenceSubmenuGenerators,
};

// Función helper genérica para generar submenús
export const generateSubmenu = <TContext, TActions>(
	category: keyof SubmenuRegistry,
	commandId: string,
	context: TContext,
	action: TActions,
): CommandItem[] => {
	const categoryGenerators = submenuRegistry[category];
	if (!categoryGenerators) return [];

	const generator = categoryGenerators[commandId] as SubmenuGenerator<
		TContext,
		TActions
	>;
	return generator ? generator(context, action) : [];
};

// Función específica para configuración (backward compatibility)
export const generateConfigSubmenu = (
	commandId: string,
	config: ConfigEditorState,
	setConfigValue: <K extends keyof ConfigEditorState>(
		key: K,
		value: ConfigEditorState[K],
	) => void,
): CommandItem[] => {
	return generateSubmenu("config", commandId, config, { setConfigValue });
};

// Función específica para apariencia
export const generateApparenceSubmenu = (
	commandId: string,
	apparence: ApparenceStoreStates,
	apparenceActions: ApparenceStoreActions["setOption"],
): CommandItem[] => {
	return generateSubmenu("apparence", commandId, apparence, apparenceActions);
};
