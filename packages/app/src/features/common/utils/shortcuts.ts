// Re-export platform utilities for convenience
export { getModifierKey, isLinux, isMac, isPWA, isWindows } from "./platform";

// Shortcuts personalizados de la app usando el modificador 'mod'
// El modificador 'mod' se traduce automáticamente a:
// - Cmd en macOS
// - Ctrl en Windows/Linux
export const RUN_CODE = "mod+r";
export const TOGGLE_CHAT = "mod+b";
export const NEW_TAB = "mod+alt+t";
export const UNDO_CLOSE_TAB = "mod+alt+shift+t";
export const TOGGLE_CONFIG = "mod+,";
export const TOGGLE_COMMAND = "mod+k";
export const GENERATE_CODE = "mod+i";

export const SHORTCUTS = [
	{
		id: "run-code",
		keys: { mac: "⌘+R", win: "Ctrl+R" },
		description: "Run the current code",
		category: "Editor",
	},
	{
		id: "toggle-chat",
		keys: { mac: "⌘+B", win: "Ctrl+B" },
		description: "Toggle AI chat panel",
		category: "AI",
	},
	{
		id: "new-tab",
		keys: { mac: "⌘+Alt+T", win: "Ctrl+Alt+T" },
		description: "Create a new tab",
		category: "Tabs",
	},
	{
		id: "undo-close-tab",
		keys: {
			mac: "⌘+Shift+T / ⌘+Alt+Shift+T",
			win: "Ctrl+Shift+T / Ctrl+Alt+Shift+T",
		},
		description: "Restore last closed tab",
		category: "Tabs",
	},
	{
		id: "toggle-config",
		keys: { mac: "⌘+,", win: "Ctrl+," },
		description: "Open settings",
		category: "Settings",
	},
	{
		id: "toggle-command",
		keys: { mac: "⌘+K", win: "Ctrl+K" },
		description: "Open command palette",
		category: "Commands",
	},
	{
		id: "generate-code",
		keys: { mac: "⌘+I", win: "Ctrl+I" },
		description: "Generate code with AI",
		category: "AI",
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
