import { isTauri } from "@tauri-apps/api/core";

export const RUN_CODE = "ctrl+r";
export const TOGGLE_CHAT = "ctrl+b";
export const NEW_TAB = isTauri() ? "ctrl+t" : "ctrl+shift+d";
export const UNDO_CLOSE_TAB = isTauri() ? "ctrl+shift+t" : "alt+d";
export const TOGGLE_CONFIG = "ctrl+,";
export const TOGGLE_COMMAND = "ctrl+k";

export const SHORTCUTS = [
	{
		id: "run-code",
		keys: RUN_CODE,
		description: "Run the current code",
		category: "Editor",
	},
	{
		id: "toggle-chat",
		keys: TOGGLE_CHAT,
		description: "Toggle AI chat panel",
		category: "AI",
	},
	{
		id: "new-tab",
		keys: NEW_TAB,
		description: "Create a new tab",
		category: "Tabs",
	},
	{
		id: "undo-close-tab",
		keys: UNDO_CLOSE_TAB,
		description: "Restore last closed tab",
		category: "Tabs",
	},
	{
		id: "toggle-config",
		keys: TOGGLE_CONFIG,
		description: "Open settings",
		category: "Settings",
	},
	{
		id: "toggle-command",
		keys: TOGGLE_COMMAND,
		description: "Open command palette",
		category: "Commands",
	},
	// Monaco Editor shortcuts

	{
		id: "find",
		keys: "Ctrl+F",
		description: "Find in editor",
		category: "Editor",
	},
	{
		id: "replace",
		keys: "Ctrl+H",
		description: "Find and replace",
		category: "Editor",
	},
	{
		id: "format",
		keys: "Shift+Alt+F",
		description: "Format code",
		category: "Editor",
	},

	{
		id: "duplicate-line",
		keys: "Shift+Alt+Down",
		description: "Duplicate line down",
		category: "Editor",
	},
	{
		id: "move-line-up",
		keys: "Alt+Up",
		description: "Move line up",
		category: "Editor",
	},
	{
		id: "move-line-down",
		keys: "Alt+Down",
		description: "Move line down",
		category: "Editor",
	},
	{
		id: "select-all",
		keys: "Ctrl+A",
		description: "Select all text",
		category: "Editor",
	},
	{
		id: "undo",
		keys: "Ctrl+Z",
		description: "Undo last action",
		category: "Editor",
	},
	{
		id: "redo",
		keys: "Ctrl+Y",
		description: "Redo last action",
		category: "Editor",
	},
	{
		id: "go-to-line",
		keys: "Ctrl+G",
		description: "Go to specific line",
		category: "Editor",
	},
	{
		id: "toggle-word-wrap",
		keys: "Alt+Z",
		description: "Toggle word wrap",
		category: "Editor",
	},
];
