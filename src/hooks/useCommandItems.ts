import { useConfigStore } from "@/store/config";
import { useHistoryTabsStore } from "@/store/history";
import { useTabsStore } from "@/store/tabs";
import type { CommandItem } from "@/types/command";
import {
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Plus,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export const useCommandItems = (): CommandItem[] => {
  const tabs = useTabsStore((state) => state.tabs);
  const activeTabId = useTabsStore((state) => state.activeTabId);
  const setActiveTab = useTabsStore((state) => state.setActiveTab);
  const newTab = useTabsStore((state) => state.newTab);
  const addTab = useTabsStore((state) => state.addTab);
  const historyTabs = useHistoryTabsStore((state) => state.tabs);
  const undoClose = useHistoryTabsStore((state) => state.undoClose);

  const config = useConfigStore((state) => state);
  const setConfigValue = useConfigStore((state) => state.setConfigValue);

  const commands: CommandItem[] = [];

  // 1. ACTION COMMANDS (New Tab)
  commands.push({
    id: "new-tab",
    title: "New Tab",
    description: "Create a new tab",
    icon: Plus,
    category: "actions",
    keywords: ["new", "nuevo", "create", "crear", "tab", "file", "archivo"],
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

  // 4. CONFIGURATION COMMANDS
  const configCommands: CommandItem[] = [
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
      icon: config.lineNumbers ? EyeOff : Eye,
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
      icon: config.whiteSpace ? EyeOff : Eye,
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
      icon: config.minimap ? MapPin : MapPin,
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
      hasSubmenu: true,
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
      hasSubmenu: true,
    },
  ];

  commands.push(...configCommands);

  return commands;
};
