import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Tab } from "@/types/editor";

interface TabsStore {
	tabs: Tab[];
	activeTabId: Tab["id"];
	setActiveTab: (id: Tab["id"]) => void;
	getCurrentTab: () => Tab | undefined;
	removeTab: (id: Tab["id"]) => void;
	addTab: (tab: Omit<Tab, "id">) => Tab["id"];
	newTab: VoidFunction;
	setEditing: (id: Tab["id"], editing?: boolean) => void;
	changeNameTab: (id: Tab["id"], name: string) => void;
	updateTabCode: (id: Tab["id"], code: string) => void;
	updateTabLog: (id: Tab["id"], logs: Tab["logs"]) => void;
	clearConsole: VoidFunction;
	getTab: (id: Tab["id"]) => Tab | undefined;
}

const DEFAULT_CODE = `
/* 
 * 🌟 Bienvenido a RunTS 🚀
 *
 * Ejecuta TypeScript y JavaScript fácilmente.
 * 
 * Características:
 * - Gratis y Open Source. 🆓
 * - Themes. 🎨
 * - auto Refresh. 🔄
 * - Chatbot en desarrollo (Google, OpenAI, Claude).
 * 
 * Contribuye al proyecto en GitHub:  
 * https://github.com/acbcdev/RunTS
 */

/* 
 * Ejemplo de código:
 */
'¡Hola, RunTS! 🌟';

[1, 2, 3].map(x => x * 2); // Duplica los números

475+465
/*
 * 💡 Tip:
 * Usa tu API Key para probar el chatbot.
 *
 * ¡Disfruta creando con RunTS! 🎉
 */
`;

const initialTabs: Tab[] = [
	{
		id: "1",
		name: "main.ts",
		language: "typescript",
		code: DEFAULT_CODE,
		logs: [],
	},
];

export const useTabsStore = create<TabsStore>()(
	persist(
		(set, get) => ({
			tabs: initialTabs,
			activeTabId: "1",
			getCurrentTab: () =>
				get().tabs.find((tab) => tab.id === get().activeTabId),
			newTab: () => {
				get().addTab({
					name: `untitled-${Date.now().toString().slice(-4)}.ts`,
					language: "typescript",
					code: "// Start coding here\n",
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
					name: tab.name.slice(0, 20),
					id: nanoid(4),
				};

				set((state) => ({
					tabs: [...state.tabs, newTab],
					activeTabId: newTab.id,
					code: newTab.code,
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
			clearConsole: () => {
				set((state) => {
					const index = state.tabs.findIndex(
						(tab) => tab.id === get().activeTabId,
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
		},
	),
);
