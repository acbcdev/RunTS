import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";
import { useAIConfigStore } from "../../ai/store/aiConfig";
import { useRun } from "../../editor/use-run/useRun";
import { useHistoryTabsStore } from "../../tabs/history/history";
import { useTabsStore } from "../../tabs/tabs-store/tabs";
import { useModalStore } from "../modal/modal";
import {
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
    }
  );
}
