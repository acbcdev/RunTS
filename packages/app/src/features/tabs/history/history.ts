import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryTabsStore } from "./types";

export const useHistoryTabsStore = create<HistoryTabsStore>()(
	persist(
		(set, get) => ({
			tabs: [],
			addTab: (tab) =>
				set((state) => ({ tabs: [...state.tabs.slice(-10), tab] })),
			removeTab: (tabId) =>
				set((state) => ({
					tabs: state.tabs.filter((tab) => tab.id !== tabId),
				})),
			undoClose: () => {
				const lastClosedTab = get().tabs.at(-1);
				if (lastClosedTab) {
					set((state) => ({
						tabs: state.tabs.slice(0, -1),
					}));
				}
				return lastClosedTab;
			},
		}),
		{
			name: "tabs-history",
		},
	),
);
