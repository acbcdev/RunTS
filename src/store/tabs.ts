import { INITIAL_TABS } from "@/consts/config";
import type { Tab } from "@/types/editor";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TabsStoreState {
  tabs: Tab[];
  activeTabId: Tab["id"];
  activeTabHistory: Tab["id"][];
}
type TabsStoreActions = {
  setActiveTab: (id: Tab["id"]) => void;
  getCurrentTab: () => Tab | undefined;
  removeTab: (id: Tab["id"]) => void;
  addTab: (tab: Omit<Tab, "id" | "createdAt" | "updatedAt">) => Tab["id"];
  newTab: (code?: string) => void;
  setEditing: (id: Tab["id"], editing?: boolean) => void;
  changeNameTab: (id: Tab["id"], name: string) => void;
  updateTabCode: (id: Tab["id"], code: string) => void;
  updateTabLog: (id: Tab["id"], logsFormated: Tab["log"]) => void;
  clearConsole: VoidFunction;
  getTab: (id: Tab["id"]) => Tab | undefined;
  setActiveTabHistory: (id: Tab["id"]) => void;
  handleTab: (dir: 1 | -1) => void;
  updateTab: (id: Tab["id"], updates: Partial<Tab>) => void;
};

type TabsStore = TabsStoreState & TabsStoreActions;

export const useTabsStore = create<TabsStore>()(
  persist(
    (set, get) => ({
      tabs: INITIAL_TABS,
      activeTabId: "1",
      activeTabHistory: [],
      updateTab: (id, updates) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], ...updates }),
          };
        });
      },

      setActiveTabHistory: (id) => {
        set((state) => ({
          activeTabHistory: [id, ...state.activeTabHistory.slice(0, 10)],
        }));
      },
      getCurrentTab: () =>
        get().tabs.find((tab) => tab.id === get().activeTabId),
      newTab: (code) => {
        const id = get().addTab({
          name: `untitled-${Date.now().toString().slice(-4)}.ts`,
          language: "typescript",
          code: code || "",
          log: "",
        });
        get().setActiveTab(id);
      },
      getTab: (id) => get().tabs.find((tab) => tab.id === id),
      setEditing: (id, editing = false) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => {
            if (tab.id === id) {
              return {
                ...tab,
                editing,
              };
            }
            return { ...tab, editing: false };
          }),
        }));
      },
      addTab: (tab) => {
        const newTab = {
          ...tab,
          name: tab.name.trim(),
          id: nanoid(7),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
        }));
        return newTab.id;
      },
      changeNameTab: (id, name) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra el tab, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              name: name,
            }),
          };
        });
      },
      removeTab: (id) => {
        set((state) => {
          const newTabs = state.tabs.filter((tab) => tab.id !== id);
          const activeTabsHistory = state.activeTabHistory.filter(
            (tabId) => tabId !== id
          );
          return {
            tabs: newTabs,
            activeTabsHistory,
            activeTabId:
              id === state.activeTabId
                ? activeTabsHistory[0] || newTabs[0]?.id
                : state.activeTabId,
          };
        });
      },
      setActiveTab: (activeTabId) => {
        get().setActiveTabHistory(activeTabId);
        set({ activeTabId });
      },

      updateTabCode: (id, code) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], code }),
            code: state.activeTabId === id ? code : state.tabs[index].code,
          };
        });
      },
      updateTabLog: (id, log) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              log,
            }),
          };
        });
      },
      clearConsole: () => {
        set((state) => {
          const index = state.tabs.findIndex(
            (tab) => tab.id === get().activeTabId
          );
          if (index === -1) return { ...state }; // Si no encuentra la pestaña, no realiza cambios
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], log: "" }),
          };
        });
      },
      handleTab: (dir) => {
        set((state) => {
          const index = state.tabs.findIndex(
            (tab) => tab.id === state.activeTabId
          );
          if (index === -1) return { ...state };
          const newIndex = (index + dir) % state.tabs.length;
          get().setActiveTab(state.tabs[newIndex].id);
          return state;
        });
      },
    }),
    {
      name: "tabs-store",
    }
  )
);
