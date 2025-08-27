import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";
import {
	NEW_TAB,
	RUN_CODE,
	TOGGLE_CHAT,
	TOGGLE_CONFIG,
	UNDO_CLOSE_TAB,
} from "@/consts/shortcuts";
import { useAIConfigStore } from "@/store/aiConfig";
import { useHistoryTabsStore } from "@/store/history";
import { useModalStore } from "@/store/modal";
import { useTabsStore } from "@/store/tabs";
import { useRun } from "./useRun";

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
		{ preventDefault: true },
	);
	useHotkeys(
		TOGGLE_CONFIG,
		() => {
			toggle("settings");
		},
		{
			splitKey: ".",
		},
	);
}
