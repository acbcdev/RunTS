import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Monaco } from "@monaco-editor/react";
import { themes } from "@/themes";
import type { Theme } from "@/types/editor";
import type { editor } from "monaco-editor";
import type { ConsoleOutput } from "@/types/worker";
import { injectLogsIntoCode } from "@/lib/addLogsToLines";

interface Tab {
	id: string;
	name: string;
	language: string;
	code: string;
	logs: ConsoleOutput[];
}
type TLayout = "vertical" | "horizontal";
interface EditorState {
	monaco: Monaco | null;
	layout: TLayout;
	editorRef: editor.IStandaloneCodeEditor | null;
	tabs: Tab[];
	activeTabId: string;
	theme: keyof typeof themes;
	fontSize: number;
	wordWrap: boolean;
	refreshTime: number | null;
	code: string;
	lineNumbers: boolean;
	fontFamily: string;
	minimap: boolean;
	currentTab: (id: Tab["id"]) => Tab | undefined;
	setLayout: (layout: TLayout) => void;
	setMinimap: (minimap: boolean) => void;
	setLineNumbers: (size: boolean) => void;
	setFontFamily: (fontFamily: string) => void;
	setMonaco: (monaco: Monaco) => void;
	setEditorRef: (editor: editor.IStandaloneCodeEditor) => void;
	addTab: (tab: Omit<Tab, "id">) => void;
	removeTab: (id: string) => void;
	setActiveTab: (id: string) => void;
	updateTabCode: (id: string, code: string) => void;
	runCode: () => void;
	resetCode: () => void;
	clearConsole: (id: Tab["id"]) => void;
	setTheme: (theme: keyof typeof themes) => void;
	setFontSize: (size: number) => void;
	setWordWrap: (enabled: boolean) => void;
	getCurrentTheme: () => Theme;
	setRefreshTime: (time: number | null) => void;
	changeNameTab: (id: string, name: string) => void;
	updateTabLog: (id: Tab["id"], logs: Tab["logs"]) => void;
}

const DEFAULT_CODE = `// Welcome to the TypeScript Code Editor!
// Try running this sample code or write your own`;

const initialTabs: Tab[] = [
	{
		id: "1",
		name: "main.ts",
		language: "typescript",
		code: DEFAULT_CODE,
		logs: [],
	},
];

export const useEditorStore = create<EditorState>()(
	persist(
		(set, get) => ({
			monaco: null,
			editorRef: null,
			tabs: initialTabs,
			activeTabId: "1",
			theme: "oneDark",
			fontSize: 14,
			wordWrap: true,
			refreshTime: 1000,
			code: initialTabs[0].code,
			fontFamily: '"Cascadia Code", monospace',
			lineNumbers: true,
			layout: "horizontal",
			minimap: true,
			currentTab: (id) => get().tabs.find((tab) => tab.id === id),
			setLayout: (layout) => set({ layout }),
			setMinimap: (minimap) => set({ minimap }),
			setLineNumbers: (lineNumbers) => set({ lineNumbers }),
			setRefreshTime: (time) => set({ refreshTime: time }),
			setMonaco: (monaco) => set({ monaco }),
			setFontFamily: (fontFamily) => set({ fontFamily }),
			setEditorRef: (editor) => set({ editorRef: editor ?? null }),

			addTab: (tab) => {
				const newTab = {
					...tab,
					id: Math.random().toString(36).substring(7),
				};
				set((state) => ({
					tabs: [...state.tabs, newTab],
					activeTabId: newTab.id,
				}));
			},
			changeNameTab: (id, name) => {
				set((state) => ({
					tabs: state.tabs.map((tab) =>
						tab.id === id ? { ...tab, name } : tab,
					),
				}));
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

			setActiveTab: (id) => set({ activeTabId: id }),

			updateTabCode: (id, code) => {
				set((state) => ({
					tabs: state.tabs.map((tab) =>
						tab.id === id ? { ...tab, code } : tab,
					),
					code: state.activeTabId === id ? code : state.code,
				}));
			},
			updateTabLog: (id, logs) => {
				set((state) => ({
					tabs: state.tabs.map((tab) =>
						tab.id === id ? { ...tab, logs } : tab,
					),
				}));
			},
			runCode: () => {
				const state = get();
				const activeTab = state.tabs.find(
					(tab) => tab.id === state.activeTabId,
				);
				if (!activeTab?.code) return;
				get().updateTabLog(state.activeTabId, [
					{
						type: "info",
						content: "Running...",
						column: 0,
						line: 0,
						timestamp: Date.now(),
					},
				]);
				const code = injectLogsIntoCode(activeTab?.code);
				const runWorker = new Promise<ConsoleOutput[]>((resolve, reject) => {
					const worker = new Worker(
						new URL("/src/workers/runCode.ts", import.meta.url),
						{
							type: "module",
						},
					);
					const timeout = setTimeout(() => {
						reject(new Error("Worker timed out"));
						worker.terminate();
					}, 10000);
					worker.postMessage({ activeTabCode: code });

					worker.onmessage = (event: MessageEvent) => {
						clearTimeout(timeout);
						resolve(event.data);
						worker.terminate();
					};

					worker.onerror = (error) => {
						clearTimeout(timeout);
						reject(error);
						worker.terminate();
					};
				});
				runWorker
					.then((output) => {
						get().updateTabLog(state.activeTabId, output);
					})
					.catch((error) => {
						get().updateTabLog(state.activeTabId, [
							{
								type: "error",
								content: error,
								line: 0,
								column: 0,
								timestamp: Date.now(),
							},
						]);
					});
			},

			resetCode: () => {
				const state = get();
				const activeTab = state.tabs.find(
					(tab) => tab.id === state.activeTabId,
				);
				if (activeTab) {
					set((state) => ({
						tabs: state.tabs.map((tab) =>
							tab.id === activeTab.id
								? { ...tab, code: initialTabs[0].code }
								: tab,
						),
						code:
							state.activeTabId === activeTab.id
								? initialTabs[0].code
								: state.code,
						output: [],
					}));
				}
			},

			clearConsole: (id) =>
				set((state) => ({
					tabs: state.tabs.map((tab) =>
						tab.id === id ? { ...tab, logs: [] } : tab,
					),
				})),

			setTheme: (theme) => {
				set({ theme });
				const currentTheme = themes[theme];
				if (get().monaco && get().editorRef) {
					get().monaco?.editor.defineTheme(theme, currentTheme.monaco);
					get().monaco?.editor.setTheme(theme);
				}
			},
			setFontSize: (fontSize) => set({ fontSize }),

			setWordWrap: (wordWrap) => set({ wordWrap }),

			getCurrentTheme: () => themes[get().theme],
		}),
		{
			name: "editorConfig",
			partialize: (state) => ({
				tabs: state.tabs,
				activeTabId: state.activeTabId,
				theme: state.theme,
				fontSize: state.fontSize,
				wordWrap: state.wordWrap,
				code: state.code,
				refreshTime: state.refreshTime,
				fontFamily: state.fontFamily,
				lineNumbers: state.lineNumbers,
				minimap: state.minimap,
				layout: state.layout,
			}),
		},
	),
);
