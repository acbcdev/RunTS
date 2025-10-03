import type { Tab } from "@/features/editor/types";

export type HistoryTabsStoreStates = {
	tabs: Tab[];
};
export type HistoryTabsStoreActions = {
	addTab: (tab: Tab) => void;
	removeTab: (tabId: Tab["id"]) => void;
	undoClose: () => Tab | undefined;
};
export type HistoryTabsStore = HistoryTabsStoreStates & HistoryTabsStoreActions;
