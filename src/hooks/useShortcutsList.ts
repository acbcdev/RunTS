import {
  NEW_TAB,
  RUN_CODE,
  TOGGLE_CHAT,
  TOGGLE_COMMAND,
  TOGGLE_CONFIG,
  UNDO_CLOSE_TAB,
} from "@/consts/shortcuts";
import { useMemo } from "react";

export interface ShortcutItem {
  id: string;
  keys: string;
  description: string;
  category: string;
}

export function useShortcutsList(): ShortcutItem[] {
  const shortcuts: ShortcutItem[] = useMemo(
    () => [
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
        id: "save",
        keys: "Ctrl+S",
        description: "Save current file",
        category: "Editor",
      },
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
        id: "comment-line",
        keys: "Ctrl+/",
        description: "Toggle line comment",
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
    ],
    []
  );

  // Filter shortcuts based on platform (Tauri vs Web)
  return shortcuts;
}
