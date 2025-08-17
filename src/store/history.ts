import type { Tab } from "@/types/editor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type HistoryTabsStoreStates = {
  tabs: Tab[];
};
type HistoryTabsStoreActions = {
  addTab: (tab: Tab) => void;
  removeTab: (tabId: Tab["id"]) => void;
  undoClose: () => Tab | undefined;
};
type HistoryTabsStore = HistoryTabsStoreStates & HistoryTabsStoreActions;

export const useHistoryTabsStore = create<HistoryTabsStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      addTab: (tab) => set((state) => ({ tabs: [...state.tabs, tab] })),
      removeTab: (tabId) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== tabId),
        })),
      undoClose: () => {
        const lastClosedTab = get().tabs.pop();
        if (lastClosedTab) {
          set((state) => ({
            tabs: state.tabs.filter((tab) => tab.id !== lastClosedTab.id),
          }));
        }
        return lastClosedTab;
      },
    }),
    {
      name: "tabs-history",
    }
  )
);
