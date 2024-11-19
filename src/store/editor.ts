import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Monaco } from "@monaco-editor/react";
import { themes } from "@/themes";
// import worker from "@/workers/runCode?worker";
import type { Theme } from "@/types/editor";
import type { editor } from "monaco-editor";
import type { ConsoleOutput } from "@/types/worker";

interface Tab {
	id: string;
	name: string;
	language: string;
	code: string;
}
type TLayout = "vertical" | "horizontal";
interface EditorState {
	monaco: Monaco | null;
	layout: TLayout;
	editorRef: editor.IStandaloneCodeEditor | null;
	tabs: Tab[];
	activeTabId: string;
	output: ConsoleOutput[];
	theme: keyof typeof themes;
	fontSize: number;
	wordWrap: boolean;
	refreshTime: number | null;
	code: string;
	lineNumbers: boolean;
	fontFamily: string;
	minimap: boolean;
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
	clearConsole: () => void;
	setTheme: (theme: keyof typeof themes) => void;
	setFontSize: (size: number) => void;
	setWordWrap: (enabled: boolean) => void;
	getCurrentTheme: () => Theme;
	setRefreshTime: (time: number | null) => void;
	changeNameTab: (id: string, name: string) => void;
}

const DEFAULT_CODE = `// Welcome to the TypeScript Code Editor!
// Try running this sample code or write your own

// Type annotations
let greeting: string = "Hello, World!";
console.log(greeting);

// Interface definition
interface Point {
  x: number;
  y: number;
}

// Function with types
function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Using the interface and function
const point1: Point = { x: 0, y: 0 };
const point2: Point = { x: 3, y: 4 };
const distance = calculateDistance(point1, point2);
console.log(\`Distance between points: \${distance}\`);

// Generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Using the generic function
const numbers = [1, 2, 3, 4, 5];
const first = firstElement(numbers);
console.log("First number:", first);

// Union types
type Status = "pending" | "completed" | "failed";
let currentStatus: Status = "pending";
console.log("Current status:", currentStatus);`;

const initialTabs: Tab[] = [
	{
		id: "1",
		name: "main.ts",
		language: "typescript",
		code: DEFAULT_CODE,
	},
];

export const useEditorStore = create<EditorState>()(
	persist(
		(set, get) => ({
			monaco: null,
			editorRef: null,
			tabs: initialTabs,
			activeTabId: "1",
			output: [],
			theme: "oneDark",
			fontSize: 14,
			wordWrap: true,
			refreshTime: 1000,
			code: initialTabs[0].code,
			fontFamily: '"Cascadia Code", monospace',
			lineNumbers: true,
			layout: "horizontal",
			minimap: true,
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
			runCode: () => {
				const state = get();
				const activeTab = state.tabs.find(
					(tab) => tab.id === state.activeTabId,
				);

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
					}, 5000);
					worker.postMessage({ activeTabCode: activeTab?.code });

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
						set({ output });
					})
					.catch((error) => {
						set({
							output: [
								{
									type: "error",
									content: error.message,
									line: 0,
									column: 0,
									timestamp: Date.now(),
								},
							],
						});
					});
			},
			// runCode: () => {
			// 	const state = get();
			// 	const activeTab = state.tabs.find(
			// 		(tab) => tab.id === state.activeTabId,
			// 	);

			// 	if (!activeTab) return;

			// 	const output: ConsoleOutput[] = [];
			// 	let currentGroupId: string | undefined;

			// 	// Create source map for console calls
			// 	const sourceMap = new Map<number, { line: number; column: number }>();
			// 	let currentPosition = 0;

			// 	const sourceFile = ts.createSourceFile(
			// 		"code.ts",
			// 		activeTab.code,
			// 		ts.ScriptTarget.Latest,
			// 		true,
			// 	);

			// 	// Visit nodes to find console calls
			// 	const visitor = (node: ts.Node) => {
			// 		if (
			// 			ts.isCallExpression(node) &&
			// 			ts.isPropertyAccessExpression(node.expression) &&
			// 			ts.isIdentifier(node.expression.expression) &&
			// 			node.expression.expression.text === "console"
			// 		) {
			// 			const { line, character } =
			// 				sourceFile.getLineAndCharacterOfPosition(node.getStart());
			// 			sourceMap.set(currentPosition++, {
			// 				line: line + 1,
			// 				column: character,
			// 			});
			// 		}
			// 		ts.forEachChild(node, visitor);
			// 	};
			// 	ts.forEachChild(sourceFile, visitor);

			// 	// Override console methods
			// 	let consolePosition = 0;
			// 	const originalConsole = {
			// 		log: console.log,
			// 		error: console.error,
			// 		info: console.info,
			// 		warn: console.warn,
			// 	};

			// 	console.log = (...args) => {
			// 		const position = sourceMap.get(consolePosition++);
			// 		output.push({
			// 			type: "log",
			// 			content: args
			// 				.map((arg) =>
			// 					typeof arg === "object"
			// 						? JSON.stringify(arg, null, 2)
			// 						: String(arg),
			// 				)
			// 				.join(" "),
			// 			line: position?.line || 0,
			// 			column: position?.column || 0,
			// 			timestamp: Date.now(),
			// 			groupId: currentGroupId,
			// 		});
			// 	};

			// 	console.error = (...args) => {
			// 		const position = sourceMap.get(consolePosition++);
			// 		output.push({
			// 			type: "error",
			// 			content: args.map((arg) => String(arg)).join(" "),
			// 			line: position?.line || 0,
			// 			column: position?.column || 0,
			// 			timestamp: Date.now(),
			// 			groupId: currentGroupId,
			// 		});
			// 	};

			// 	console.info = (...args) => {
			// 		const position = sourceMap.get(consolePosition++);
			// 		output.push({
			// 			type: "info",
			// 			content: args.map((arg) => String(arg)).join(" "),
			// 			line: position?.line || 0,
			// 			column: position?.column || 0,
			// 			timestamp: Date.now(),
			// 			groupId: currentGroupId,
			// 		});
			// 	};

			// 	console.warn = (...args) => {
			// 		const position = sourceMap.get(consolePosition++);
			// 		output.push({
			// 			type: "warn",
			// 			content: args.map((arg) => String(arg)).join(" "),
			// 			line: position?.line || 0,
			// 			column: position?.column || 0,
			// 			timestamp: Date.now(),
			// 			groupId: currentGroupId,
			// 		});
			// 	};

			// 	try {
			// 		// Transpile and execute code
			// 		const result = ts.transpileModule(activeTab.code, {
			// 			compilerOptions: {
			// 				target: ts.ScriptTarget.ES2020,
			// 				module: ts.ModuleKind.ESNext,
			// 				strict: true,
			// 				esModuleInterop: true,
			// 			},
			// 		});

			// 		new Function(result.outputText)();
			// 	} catch (error) {
			// 		output.push({
			// 			type: "error",
			// 			content: `Runtime Error: ${error ?? "Unknown error"}`,
			// 			line: 0,
			// 			column: 0,
			// 			timestamp: Date.now(),
			// 			groupId: currentGroupId,
			// 		});
			// 	}

			// 	// Restore original console methods
			// 	console.log = originalConsole.log;
			// 	console.error = originalConsole.error;
			// 	console.info = originalConsole.info;
			// 	console.warn = originalConsole.warn;

			// 	set({ output });
			// },

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

			clearConsole: () => set({ output: [] }),

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
				output: state.output,
				refreshTime: state.refreshTime,
				fontFamily: state.fontFamily,
				lineNumbers: state.lineNumbers,
				minimap: state.minimap,
				layout: state.layout,
			}),
		},
	),
);
