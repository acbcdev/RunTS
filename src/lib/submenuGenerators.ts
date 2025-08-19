import { REFRESH_TIMES, RENDER_LINES } from "@/consts/config";
import type { ConfigEditorState } from "@/store/config";
import type { CommandItem } from "@/types/command";
import { Hash, Timer } from "lucide-react";

// Tipo para los generadores de submenús
type SubmenuGenerator = (
  config: ConfigEditorState,
  setConfigValue: <K extends keyof ConfigEditorState>(
    key: K,
    value: ConfigEditorState[K]
  ) => void
) => CommandItem[];

// Objeto con todos los generadores de submenús
export const submenuGenerators: Record<string, SubmenuGenerator> = {
  "refresh-time": (config, setConfigValue) =>
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

  "line-renderer": (config, setConfigValue) =>
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

// Función helper para generar submenús
export const generateSubmenu = (
  commandId: string,
  config: ConfigEditorState,
  setConfigValue: <K extends keyof ConfigEditorState>(
    key: K,
    value: ConfigEditorState[K]
  ) => void
): CommandItem[] => {
  const generator = submenuGenerators[commandId];
  return generator ? generator(config, setConfigValue) : [];
};
