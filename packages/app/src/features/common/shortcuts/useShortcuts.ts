import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { useRun } from "@/features/editor/use-run/useRun";
import { useHistoryTabsStore } from "@/features/tabs/history/history";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useModalStore } from "../modal/modal";
import {
  GENERATE_CODE,
  isMac,
  isPWA,
  NEW_TAB,
  RUN_CODE,
  TOGGLE_CHAT,
  TOGGLE_CONFIG,
  UNDO_CLOSE_TAB,
} from "../utils/shortcuts";
export function useShortcuts() {
  const toggle = useModalStore((state) => state.toggleModal);
  const addTab = useTabsStore(useShallow((state) => state.addTab));
  const undoClose = useHistoryTabsStore(useShallow((state) => state.undoClose));
  const newTab = useTabsStore(useShallow((state) => state.newTab));
  const toggleChat = useAIConfigStore(useShallow((state) => state.toggleChat));
  const { runCode } = useRun();
  useHotkeys(RUN_CODE, runCode, { preventDefault: true });
  useHotkeys(TOGGLE_CHAT, () => toggleChat(), { preventDefault: true });
  useHotkeys(NEW_TAB, () => newTab(), { preventDefault: true });
  useHotkeys(
    UNDO_CLOSE_TAB,
    () => {
      const tab = undoClose();
      if (tab) addTab(tab);
    },
    { preventDefault: true }
  );
  useHotkeys(
    TOGGLE_CONFIG,
    () => {
      toggle("settings");
    },
    {
      splitKey: ".",
      preventDefault: true,
    }
  );

  // PWA-specific shortcuts
  useEffect(() => {
    if (isPWA()) {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Check for Cmd/Ctrl+T (without Shift or Alt)
        const modificador = isMac() ? event.metaKey : event.ctrlKey;
        const isModT =
          modificador && event.key === "t" && !event.shiftKey && !event.altKey;
        if (isModT) {
          event.preventDefault();
          newTab();
        }
        const isModShiftT =
          modificador && event.key === "T" && event.shiftKey && !event.altKey;
        if (isModShiftT) {
          event.preventDefault();
          const tab = undoClose();
          if (tab) addTab(tab);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [newTab, addTab, undoClose]);
}
