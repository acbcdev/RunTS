import {
	ALargeSmall,
	Brush,
	ChevronRight,
	Cog,
	Columns3CogIcon,
	Command,
	FileText,
	LetterText,
	PanelBottom,
	PanelLeft,
	PanelRight,
	PanelTop,
	Plus,
	RotateCcw,
	Square,
	SquareRoundCorner,
	SquareSplitHorizontal,
	SquareSplitVertical,
	ToggleLeft,
	ToggleRight,
	Type,
	TypeOutline,
} from "lucide-react";
import {
	SIDES,
	useApparenceStore,
} from "@/features/settings/appearance-store/appearance";
import {
	FONT_FAMILIES,
	FONT_SIZES,
	RADIUS_SIZES,
	REFRESH_TIMES,
	RENDER_LINES,
} from "@/features/settings/config-consts/config";
import { useConfigStore } from "@/features/settings/config-store/config";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useHistoryTabsStore } from "../../tabs/history/history";
import { useModalStore } from "../modal/modal";
import { themes } from "../themes";
import { getModifierKey, isMac } from "../utils/shortcuts";
import type { CommandOption, CommandOptionChild } from "./types";

export const useCommandItems = (): {
	commands: CommandOption[];
	subCommands: Record<string, CommandOptionChild[]>;
} => {
	const tabs = useTabsStore((state) => state.tabs);
	const activeTabId = useTabsStore((state) => state.activeTabId);
	const setActiveTab = useTabsStore((state) => state.setActiveTab);
	const newTab = useTabsStore((state) => state.newTab);
	const addTab = useTabsStore((state) => state.addTab);

	const historyTabs = useHistoryTabsStore((state) => state.tabs);
	const undoClose = useHistoryTabsStore((state) => state.undoClose);

	const config = useConfigStore((state) => ({
		wordWrap: state.wordWrap,
		lineNumbers: state.lineNumbers,
		refreshTime: state.refreshTime,
		minimap: state.minimap,
		whiteSpace: state.whiteSpace,
		lineRenderer: state.lineRenderer,
	}));
	const setConfigValue = useConfigStore((state) => state.setConfigValue);
	const toggle = useModalStore((state) => state.toggleModal);
	const commands: CommandOption[] = [];
	const layout = useApparenceStore((state) => state.layout);
	const setOption = useApparenceStore((state) => state.setOption);
	const theme = useApparenceStore((state) => state.theme);
	const fontFamily = useApparenceStore((state) => state.fontFamily);
	const fontSize = useApparenceStore((state) => state.fontSize);
	const radius = useApparenceStore((state) => state.radius);
	const side = useApparenceStore((state) => state.side);
  // 1. ACTION COMMANDS (New Tab)
  commands.push({
    id: "new-tab",
    title: "New Tab",
    description: "Create a new tab",
    icon: Plus,
    category: "actions",
    keywords: ["new", "nuevo", "create", "crear", "tab", "file", "archivo"],
    shortcut: `${getModifierKey()}+Alt+T`,
    action: () => newTab(),
  });

	// 2. ACTIVE TABS
	for (const tab of tabs) {
		const isActive = tab.id === activeTabId;
		commands.push({
			id: `tab-${tab.id}`,
			title: tab.name,
			description: isActive ? "Active tab" : "Switch to this tab",
			icon: FileText,
			category: "tabs",
			keywords: [
				tab.name,
				tab.language,
				"tab",
				"archivo",
				"file",
				"switch",
				"cambiar",
				"tabs",
			],
			action: () => setActiveTab(tab.id),
		});
	}

	// 3. HISTORY TABS (Closed tabs)
	for (const tab of historyTabs) {
		commands.push({
			id: `closed-${tab.id}`,
			title: `${tab.name} (Closed)`,
			description: "Restore closed tab",
			icon: RotateCcw,
			category: "history",
			keywords: [
				tab.name,
				"closed",
				"cerrado",
				"restore",
				"restaurar",
				"undo",
				"deshacer",
				"tabs",
				"history",
			],
			action: () => {
				const tab = undoClose();
				if (tab) addTab(tab);
			},
		});
	}
	const subCommands: Record<string, CommandOptionChild[]> = {
		themes: Object.entries(themes).map(([themeName, value]) => ({
			id: `theme-${String(themeName)}`,
			title: value.name,
			parentId: "change-theme",
			description: `Switch to ${value.name} theme`,
			icon: Brush,
			isSelected: themeName === theme,
			category: "apparence",
			keywords: [
				String(themeName),
				"theme",
				"color",
				"appearance",
				"config",
				"settings",
			],
			action: () => setOption("theme", themeName),
			preventDefault: true,
		})),
		fonts: FONT_FAMILIES.map((font) => ({
			id: `font-${font.value}`,
			title: font.name,
			parentId: "change-font-family",
			description: `Switch to ${font.name} font`,
			icon: Type,
			category: "apparence",
			isSelected: font.value === fontFamily,
			keywords: [font.name, "font", "text", "typography", "config", "settings"],
			action: () => setOption("fontFamily", font.value),
			preventDefault: true,
		})),
		"font-sizes": FONT_SIZES.map((font) => ({
			id: `font-${font}`,
			title: String(font),
			parentId: "change-font-size",
			// description: `Switch to ${font} font`,
			isSelected: font === fontSize,
			icon: LetterText,
			category: "apparence",
			keywords: [
				String(font),
				"font",
				"text",
				"typography",
				"config",
				"settings",
			],
			action: () => setOption("fontSize", font),
			preventDefault: true,
		})),
		radius: RADIUS_SIZES.map((radiusItem) => ({
			id: `border-radius-${radiusItem.size}`,
			title: radiusItem.display,
			parentId: "change-border-radius",
			description: `Switch to ${radiusItem.size}rem border radius`,
			icon: Square,
			category: "apparence",
			keywords: [
				String(radiusItem),
				"border",
				"radius",
				"appearance",
				"config",
				"settings",
			],
			isSelected: radiusItem.size === radius,
			action: () => setOption("radius", radiusItem.size),
			preventDefault: true,
		})),
		side: Object.entries(SIDES).map(([sideName, value]) => ({
			id: `side-${sideName}`,
			title: `${sideName.toLowerCase()} side`,
			parentId: "side-actions-position",
			// description: `Position actions on the ${sideName.toLowerCase()} side`,
			icon:
				value === SIDES.BOTTOM
					? PanelBottom
					: value === SIDES.TOP
						? PanelTop
						: value === SIDES.LEFT
							? PanelLeft
							: PanelRight,
			isSelected: value === side,
			category: "apparence",
			keywords: [
				sideName,
				"side",
				"position",
				"layout",
				"top",
				"bottom",
				"left",
				"right",
			],
			action: () => setOption("side", value),
			preventDefault: true,
		})),
		refresh: REFRESH_TIMES.map((time) => ({
			id: `refresh-time-${time.value}`,
			parentId: "refresh-time",
			title: time.time,
			description: `Set refresh time to ${time.time}`,
			icon: ChevronRight,
			category: "config" as const,
			isSelected: time.value === config.refreshTime,
			keywords: [time.time, `${time.value}ms`, "time", "tiempo", "refresh"],
			action: () => setConfigValue("refreshTime", time.value),
			preventDefault: true,
		})),
		"render-line": RENDER_LINES.map((mode) => ({
			id: `render-${mode}`,
			parentId: "line-renderer",
			title:
				mode === "line"
					? "Line Mode"
					: mode === "gutter"
						? "Gutter Mode"
						: mode === "all"
							? "All Mode"
							: "None Mode",
			description: `Switch to ${mode} rendering`,
			icon: ChevronRight,
			isSelected: mode === config.lineRenderer,

			category: "config" as const,
			keywords: [mode, "render", "renderizado", "mode", "modo"],
			action: () => setConfigValue("lineRenderer", mode),
			preventDefault: true,
		})),
	};

	// 4. CONFIGURATION COMMANDS
	const configCommands: CommandOption[] = [
		{
			id: "change-theme",
			title: "Change Theme",
			description: "Select a new theme",
			icon: Brush,
			category: "apparence",
			keywords: ["theme", "color", "appearance", "config", "settings"],
			action: () => {},
			preventDefault: true,
			route: "Themes",
			children: "themes",
		},

		{
			id: "change-font-family",
			title: "Change Font Family",
			description: "Select a new font",
			icon: TypeOutline,
			category: "apparence",
			keywords: ["font", "text", "typography", "config", "settings"],
			action: () => {},
			preventDefault: true,
			route: "Fonts",
			children: "fonts",
		},
		{
			id: "change-font-size",
			title: "Change Font Size",
			description: "Select a new font size",
			icon: ALargeSmall,
			category: "apparence",
			keywords: [
				"font",
				"text",
				"typography",
				"appearance",
				"config",
				"settings",
			],
			action: () => {},
			preventDefault: true,
			route: "Font Size",
			children: "font-sizes",
		},
		{
			id: "change-border-radius",
			title: "Change Border Radius",
			description: "Select a new border radius",
			icon: SquareRoundCorner,
			category: "apparence",
			keywords: ["border", "radius", "appearance", "config", "settings"],
			action: () => {},
			preventDefault: true,
			route: "Border Radius",
			children: "radius",
		},
        {
          id: "open-settings",
          title: "Open Settings",
          description: "Open the settings panel",
          icon: Cog,
          category: "config",
          keywords: [
            "open",
            "configuration",
            "ajustes",
            "abrir",
            "config",
            "settings",
          ],
          shortcut: `${getModifierKey()}+,`,
          action: () => {
            toggle("settings");
          },
        },
        {
          id: "open-shortcuts",
          title: "Open Shortcuts",
          description: "Open the shortcuts panel",
          icon: Command,
          category: "config",
          keywords: [
            "open",
            "shortcuts",
            "comandos",
            "abrir",
            "config",
            "settings",
          ],
          action: () => {
            toggle("shortcuts");
          },
        },
		{
			id: "toggle-layout",
			title: "Toggle Layout",
			description: "Toggle the editor layout",
			icon:
				layout === "horizontal" ? SquareSplitHorizontal : SquareSplitVertical,
			category: "config",
			keywords: ["toggle", "layout", "editor", "config", "settings"],
			action: () => {
				setOption(
					"layout",
					layout === "horizontal" ? "vertical" : "horizontal",
				);
			},
			preventDefault: true,
		},
		{
			id: "side-actions-position",
			title: "Side Position",
			description: "Toggle the editor layout",
			icon: Columns3CogIcon,
			category: "apparence",
			keywords: ["layout", "side", "position", "editor", "config", "settings"],
			action: () => {},
			preventDefault: true,
			route: "Side",
			children: "side",
		},

		{
			id: "toggle-word-wrap",
			title: config.wordWrap ? "Disable Word Wrap" : "Enable Word Wrap",
			description: "Toggle line wrapping",
			icon: config.wordWrap ? ToggleRight : ToggleLeft,
			category: "config",
			keywords: [
				"word",
				"wrap",
				"ajuste",
				"linea",
				"line",
				"wrapping",
				"toggle",
				"configuration",
				"config",
				"settings",
			],
			action: () => setConfigValue("wordWrap", !config.wordWrap),
			preventDefault: true,
		},

		{
			id: "toggle-line-numbers",
			title: config.lineNumbers ? "Hide Line Numbers" : "Show Line Numbers",
			description: "Toggle line numbers display",
			icon: config.lineNumbers ? ToggleRight : ToggleLeft,

			category: "config",
			keywords: [
				"numbers",
				"numeros",
				"line",
				"linea",
				"show",
				"mostrar",
				"hide",
				"ocultar",
				"configuration",
				"config",
				"settings",
			],
			action: () => setConfigValue("lineNumbers", !config.lineNumbers),
			preventDefault: true,
		},
		{
			id: "toggle-whitespace",
			title: config.whiteSpace ? "Hide Whitespace" : "Show Whitespace",
			description: "Toggle whitespace visualization",
			icon: config.whiteSpace ? ToggleRight : ToggleLeft,

			category: "config",
			keywords: [
				"spaces",
				"espacios",
				"white",
				"blanco",
				"whitespace",
				"show",
				"mostrar",
				"hide",
				"ocultar",
				"configuration",
				"config",
				"settings",
			],
			action: () => setConfigValue("whiteSpace", !config.whiteSpace),
			preventDefault: true,
		},
		{
			id: "toggle-minimap",
			title: config.minimap ? "Disable Minimap" : "Enable Minimap",
			description: "Toggle editor minimap",
			icon: config.minimap ? ToggleRight : ToggleLeft,

			category: "config",
			keywords: [
				"minimap",
				"map",
				"mapa",
				"navigation",
				"navegacion",
				"overview",
				"configuration",
				"config",
				"settings",
			],
			action: () => setConfigValue("minimap", !config.minimap),
			preventDefault: true,
		},
		{
			id: "refresh-time",
			title: "Refresh Time",
			description: `Current: ${config.refreshTime}ms`,
			icon: ChevronRight,
			category: "config",
			keywords: [
				"time",
				"tiempo",
				"refresh",
				"actualizacion",
				"speed",
				"velocidad",
				"delay",
				"configuration",
				"config",
				"settings",
			],
			action: () => {},
			preventDefault: true,
			route: "Refresh",
			children: "refresh",
		},
		{
			id: "line-renderer",
			title: "Render Mode",
			description: `Current: ${config.lineRenderer}`,
			icon: ChevronRight,
			category: "config",
			keywords: [
				"render",
				"renderizado",
				"line",
				"linea",
				"mode",
				"modo",
				"display",
				"configuration",
				"config",
				"settings",
			],
			action: () => {},
			preventDefault: true,
			route: "Render Line",
			children: "render-line",
		},
	];

	commands.push(...configCommands);

	return { commands, subCommands };
};
