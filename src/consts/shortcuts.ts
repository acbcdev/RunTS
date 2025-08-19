import { isTauri } from "@tauri-apps/api/core";

export const RUN_CODE = "ctrl+r";
export const TOGGLE_CHAT = "ctrl+b";
export const NEW_TAB = isTauri() ? "ctrl+t" : "ctrl+q";
export const UNDO_CLOSE_TAB = isTauri() ? "ctrl+shift+t" : "ctrl+shift+q";
export const TOGGLE_CONFIG = "ctrl+,";
export const TOGGLE_COMMAND = "ctrl+k";
