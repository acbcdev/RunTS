import { DEFAULT_CODE } from "@/consts";
import type { Tab } from "@/types/editor";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TabsStoreState {
  tabs: Tab[];
  activeTabId: Tab["id"];
}
type TabsStoreActions = {
  setActiveTab: (id: Tab["id"]) => void;
  getCurrentTab: () => Tab | undefined;
  removeTab: (id: Tab["id"]) => void;
  addTab: (tab: Omit<Tab, "id">) => Tab["id"];
  newTab: (code?: string) => void;
  setEditing: (id: Tab["id"], editing?: boolean) => void;
  changeNameTab: (id: Tab["id"], name: string) => void;
  updateTabCode: (id: Tab["id"], code: string) => void;
  updateTabLog: (id: Tab["id"], logs: Tab["logs"]) => void;
  updateTabLogFormated: (
    id: Tab["id"],
    logsFormated: Tab["logsFormated"]
  ) => void;
  clearConsole: VoidFunction;
  getTab: (id: Tab["id"]) => Tab | undefined;
};

type TabsStore = TabsStoreState & TabsStoreActions;
const initialTabs: Tab[] = [
  {
    id: "1",
    name: "main.ts",
    language: "typescript",
    code: DEFAULT_CODE,
    logs: [],
    logsFormated: "",
  },
];

export const useTabsStore = create<TabsStore>()(
  persist(
    (set, get) => ({
      tabs: initialTabs,
      activeTabId: "1",
      getCurrentTab: () =>
        get().tabs.find((tab) => tab.id === get().activeTabId),
      newTab: (code) => {
        get().addTab({
          name: `untitled-${Date.now().toString().slice(-4)}.ts`,
          language: "typescript",
          code: code || "",
          logsFormated: "",
          logs: [],
        });
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
          id: nanoid(4),
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
          return {
            tabs: newTabs,
            activeTabId:
              id === state.activeTabId
                ? newTabs[0]?.id || ""
                : state.activeTabId,
          };
        });
      },
      setActiveTab: (activeTabId) => set({ activeTabId }),
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
      updateTabLog: (id, logs) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              logs,
            }),
          };
        });
      },
      updateTabLogFormated: (id, logsFormated) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              logsFormated,
            }),
          };
        });
      },
      clearConsole: () => {
        set((state) => {
          const index = state.tabs.findIndex(
            (tab) => tab.id === get().activeTabId
          );
          if (index === -1) return state; // Si no encuentra la pestaña, no realiza cambios
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], logs: [] }),
          };
        });
      },
    }),
    {
      name: "tabs-store",
    }
  )
);
