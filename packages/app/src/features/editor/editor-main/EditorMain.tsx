import type { Monaco } from "@monaco-editor/react";
import { Code2 } from "lucide-react";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { lazy, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { useModalStore } from "@/features/common/modal/modal";
import { themes } from "@/features/common/themes";
import { EDITOR_CONFIG } from "@/features/common/utils/editor";
import { extraLib } from "@/features/common/utils/extraLib";
import { useApparenceStore } from "@/features/settings/appearance-store/appearance";
import { useConfigStore } from "@/features/settings/config-store/config";
import { useHistoryTabsStore } from "@/features/tabs/history/history";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { Loader } from "@/features/ui/loader";
import { useEditorStore } from "../editor-store/editor";
import type { Tab } from "../types";
import { useRun } from "../use-run/useRun";
import Loading from "./Loading";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));
type EditorMainProps = {
	tab: Tab;
};
export function EditorMain({ tab }: EditorMainProps) {
	const { runCode } = useRun();
	const updateEditor = useEditorStore(
		useShallow((state) => state.updateEditor),
	);
	const toggle = useModalStore(useShallow((state) => state.toggleModal));
	const running = useEditorStore(useShallow((state) => state.running));
	const {
		wordWrap,
		lineNumbers,
		minimap,
		whiteSpace,
		lineRenderer,
		toggleConfig,
	} = useConfigStore(
		useShallow((state) => ({
			wordWrap: state.wordWrap,
			lineNumbers: state.lineNumbers,
			minimap: state.minimap,
			whiteSpace: state.whiteSpace,
			lineRenderer: state.lineRenderer,
			toggleConfig: state.toggleConfig,
		})),
	);
	// useTabsStore
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const updateTabCode = useTabsStore(
		useShallow((state) => state.updateTabCode),
	);
	const newTab = useTabsStore(useShallow((state) => state.newTab));
	// const moveTab = useTabsStore(useShallow((state) => state.handleTab));
	// const removeTab = useTabsStore(useShallow((state) => state.removeTab));
	// const addTabHistory = useHistoryTabsStore(
	// 	useShallow((state) => state.addTab),
	// );

	const undo = useHistoryTabsStore(useShallow((state) => state.undoClose));

	const addTab = useTabsStore(useShallow((state) => state.addTab));

	const toogleChat = useAIConfigStore(useShallow((state) => state.toggleChat));
	// useApparenceStore
	const { theme, fontFamily, fontSize } = useApparenceStore(
		useShallow((state) => ({
			theme: state.theme,
			fontFamily: state.fontFamily,
			fontSize: state.fontSize,
		})),
	);

	const handleEditorDidMount = useCallback(
		async (editor: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
			// Define all themes
			for (const [key, value] of Object.entries(themes)) {
				monacoInstance.editor.defineTheme(key, value.monaco);
			}
			monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
				{
					target: monacoInstance.languages.typescript.ScriptTarget.Latest,
					module: monacoInstance.languages.typescript.ModuleKind.ESNext,
					allowNonTsExtensions: true,
					diagnosticCodesToIgnore: [2393],
					lib: ["esnext", "dom"],
				},
			);
			monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
				{
					noSemanticValidation: false,
					noSyntaxValidation: false,
				},
			);
			// editor.addCommand(
			// 	monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.RightArrow,
			// 	() => {
			// 		moveTab(1);
			// 	},
			// );
			// editor.addCommand(
			// 	monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.LeftArrow,
			// 	() => {
			// 		moveTab(-1);
			// 	},
			// );
			// editor.addCommand(
			// 	monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.KeyW,
			// 	() => {
			// 		const currentActiveTab = getCurrentTab();
			// 		if (currentActiveTab && currentActiveTab?.code.trim() !== "") {
			// 			addTabHistory(currentActiveTab);
			// 			removeTab(currentActiveTab.id);
			// 		}
			// 	},
			// );

			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyR,
				runCode,
			);

			editor.addAction({
				id: "run-code",
				label: "Run Code",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyR,
				],
				run: runCode,
			});

			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyB,
				() => toogleChat(),
			);
			editor.addAction({
				id: "show-chat",
				label: "Show Chat",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyB,
				],
				run: () => toogleChat(),
			});

			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd |
					monacoInstance.KeyMod.Shift |
					monacoInstance.KeyCode.KeyD,
				() => newTab(),
			);
			editor.addAction({
				id: "new-tab",
				label: "New Tab",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd |
						monacoInstance.KeyMod.Shift |
						monacoInstance.KeyCode.KeyD,
				],
				run: () => newTab(),
			});

			editor.addCommand(
				monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.KeyD,
				() => {
					const tab = undo();
					if (tab) addTab(tab);
				},
			);
			editor.addAction({
				id: "undo-tab-close-action",
				label: "Undo Tab Close",
				keybindings: [monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.KeyD],
				run: () => {
					const tab = undo();
					if (tab) addTab(tab);
				},
			});

			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Comma,
				() => {
					toggle("settings");
				},
			);
			editor.addAction({
				id: "settings",
				label: "Open Settings",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Comma,
				],
				run: () => {
					toggle("settings");
				},
			});
			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK,
				() => {
					toggle("commandK");
				},
			);
			editor.addCommand(
				monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.KeyZ,
				() => {
					toggleConfig("wordWrap");
				},
			);
			editor.addAction({
				id: "cmd-k",
				label: "Open Command Palette",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK,
				],
				run: () => {
					toggle("commandK");
				},
			});

			monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
				extraLib,
				"file:///custom.d.ts",
			);
			monacoInstance.languages.registerCompletionItemProvider("typescript", {
				provideCompletionItems: () => ({
					suggestions: [
						{
							label: ".log", // La palabra que activa el autocompletado
							kind: monaco.languages.CompletionItemKind.Snippet, // Tipo de sugerencia
							documentation: "Insert a console.log() statement",
							insertText: "console.log($1);", // Texto que se inserta
							insertTextRules:
								monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
							range:
								editor.getModel()?.getFullModelRange() ||
								new monaco.Range(1, 1, 1, 1), // Rango para reemplazar
						},
						{
							label: "console.", // La palabra que activa el autocompletado
							kind: monaco.languages.CompletionItemKind.Snippet, // Tipo de sugerencia
							documentation: "Insert a console.log() statement",
							insertText: "console.log($1);", // Texto que se inserta
							insertTextRules:
								monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
							range:
								editor.getModel()?.getFullModelRange() ||
								new monaco.Range(1, 1, 1, 1), // Rango para reemplazar
						},
					],
				}),
			});
			monacoInstance.editor.setTheme(theme);
			updateEditor({ editorRef: editor });
			updateEditor({ monaco: monacoInstance });
		},
		[
			theme,
			updateEditor,
			addTab,
			newTab,
			runCode,
			toggle,
			toggleConfig,
			toogleChat,
			undo,
		],
	);

	return (
		<div className="relative h-full" translate="no">
			{running && <Loader className="absolute z-10 right-6 top-2" />}
			<MonacoEditor
				loading={
					<Loading
						Icon={Code2}
						text="Loading Editor..."
						description="Please wait while we load the editor."
					/>
				}
				height="100%"
				defaultLanguage="typescript"
				value={tab?.code}
				onChange={(value) => updateTabCode(activeTabId, value || "")}
				onMount={handleEditorDidMount}
				theme={theme}
				options={{
					// Theme
					theme,
					// Editor Core Configuration
					fontSize,
					fontFamily,
					wordWrap: wordWrap ? "on" : "off",
					renderLineHighlight: lineRenderer,
					minimap: {
						enabled: minimap,
					},
					renderWhitespace: whiteSpace ? "all" : "selection",
					lineNumbers: lineNumbers ? "on" : "off",
					...EDITOR_CONFIG,
				}}
			/>
		</div>
	);
}

EditorMain.displayName = "EditorMain";

export default EditorMain;
