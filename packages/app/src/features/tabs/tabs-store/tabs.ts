import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_TABS } from "@/features/settings/config-consts/config";
import type { TabsStore } from "./types";

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

      getCurrentTab: () =>
        get().tabs.find((tab) => tab.id === get().activeTabId),
      newTab: (data) => {
        const id = nanoid(7);
        const now = Date.now();
        set((state) => ({
          tabs: [
            ...state.tabs,
            {
              language: "typescript",
              code: "",
              log: "",
              ...data,
              name: data?.name?.trim() ?? "",
              id,
              createdAt: now,
              updatedAt: now,
            },
          ],
          activeTabId: id,
          activeTabHistory: [id, ...state.activeTabHistory.slice(0, 10)],
        }));
      },
      restoreTab: (tab) => {
        const id = nanoid(7);
        const now = Date.now();
        const { id: _id, createdAt: _c, updatedAt: _u, ...tabData } = tab;
        set((state) => ({
          tabs: [
            ...state.tabs,
            {
              ...tabData,
              name: tabData.name?.trim() ?? "",
              id,
              createdAt: now,
              updatedAt: now,
            },
          ],
          activeTabId: id,
          activeTabHistory: [id, ...state.activeTabHistory.slice(0, 10)],
        }));
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
            (tabId) => tabId !== id,
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
        set((state) => ({
          activeTabId,
          activeTabHistory: [activeTabId, ...state.activeTabHistory.slice(0, 10)],
        }));
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
            (tab) => tab.id === get().activeTabId,
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
            (tab) => tab.id === state.activeTabId,
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
    },
  ),
);
