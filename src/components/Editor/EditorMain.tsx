import { extraLib } from "@/consts/extraLib";
import { useRun } from "@/hooks/useRun";
import { useAIConfigStore } from "@/store/aiConfig";
import { useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { useTabsStore } from "@/store/tabs";
import { themes } from "@/themes";
import type { Monaco } from "@monaco-editor/react";
import { Loader } from "lucide-react";
import { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { Suspense, lazy, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export function EditorMain() {
	const { runCode } = useRun();
	// useEditorStore
	const setMonaco = useEditorStore(useShallow((state) => state.setMonaco));
	const setEditorRef = useEditorStore(
		useShallow((state) => state.setEditorRef),
	);
	const running = useEditorStore(useShallow((state) => state.running));
	// useConfigStore
	const { wordWrap, lineNumbers, minimap, whiteSpace, lineRenderer } =
		useConfigStore(
			useShallow((state) => ({
				wordWrap: state.wordWrap,
				lineNumbers: state.lineNumbers,
				minimap: state.minimap,
				whiteSpace: state.whiteSpace,
				lineRenderer: state.lineRenderer,
			})),
		);
	// useTabsStore
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const updateTabCode = useTabsStore(
		useShallow((state) => state.updateTabCode),
	);
	const newTab = useTabsStore(useShallow((state) => state.newTab));
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const toogleChat = useAIConfigStore(useShallow((state) => state.toggleChat));
	// useApparenceStore
	const { theme, fontFamily, fontSize } = useApparenceStore(
		useShallow((state) => ({
			theme: state.theme,
			fontFamily: state.fontFamily,
			fontSize: state.fontSize,
		})),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
			editor.addCommand(
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyG,
				runCode,
			);
			editor.addAction({
				id: "run-code",
				label: "Run Code",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyQ,
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
					monacoInstance.KeyCode.KeyD |
					monacoInstance.KeyMod.Shift,
				() => newTab(),
			);
			editor.addAction({
				id: "new-tab",
				label: "New Tab",
				keybindings: [
					monacoInstance.KeyMod.CtrlCmd |
						monacoInstance.KeyCode.KeyD |
						monacoInstance.KeyMod.Shift,
				],
				run: () => newTab(),
			});
			monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
				{
					noSemanticValidation: false,
					noSyntaxValidation: false,
				},
			);

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
			setEditorRef(editor);
			setMonaco(monacoInstance);
		},
		[setMonaco, setEditorRef],
	);

	return (
		<div className="relative h-full" translate="no">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full bg-background animate-pulse">
						<div className="text-lg animate-pulse">Loading editor...</div>
					</div>
				}
			>
				{running && (
					<Loader className="absolute z-10 text-accent animate-spin right-6 top-2 size-10" />
				)}
				<MonacoEditor
					height="100%"
					defaultLanguage="typescript"
					value={getCurrentTab()?.code}
					onChange={(value) => updateTabCode(activeTabId, value || "")}
					onMount={handleEditorDidMount}
					theme={theme}
					options={{
						// Editor Core Configuration
						automaticLayout: true,
						fontSize,
						fontFamily,
						fontLigatures: true,
						tabSize: 2,
						trimAutoWhitespace: true,
						glyphMargin: true,
						wordWrap: wordWrap ? "on" : "off",
						fixedOverflowWidgets: true,
						occurrencesHighlight: "singleFile",
						// Auto-formatting & Indentation
						autoIndent: "full",
						formatOnPaste: true,
						formatOnType: true,
						guides: {
							bracketPairs: true,
							indentation: true,
						},
						autoClosingBrackets: "always",
						autoClosingQuotes: "always",
						// Code Intelligence
						codeLens: true,
						lightbulb: {
							enabled: editor.ShowLightbulbIconMode.On,
						},
						inlineSuggest: { enabled: true },
						suggest: {
							showMethods: true,
							showFunctions: true,
							showConstructors: true,
							showDeprecated: true,
							showSnippets: true,
							showConstants: true,
							showVariables: true,
							showInterfaces: true,
							showKeywords: true,
						},
						quickSuggestions: true,
						suggestOnTriggerCharacters: true,
						acceptSuggestionOnEnter: "on",

						// Navigation & References
						links: true,
						gotoLocation: {
							multipleDeclarations: "goto",
							multipleImplementations: "goto",
							multipleDefinitions: "goto",
						},

						// Visual Indicators
						showDeprecated: true,
						showUnused: true,
						colorDecorators: true,
						showFoldingControls: "always",
						bracketPairColorization: {
							enabled: true,
						},
						renderControlCharacters: true,
						renderLineHighlight: lineRenderer,
						renderValidationDecorations: "on",
						renderWhitespace: whiteSpace ? "all" : "selection",
						"semanticHighlighting.enabled": true,

						// Editor UI Features
						minimap: {
							enabled: minimap,
						},
						lineNumbers: lineNumbers ? "on" : "off",
						padding: {
							top: 20,
							bottom: 12,
						},
						scrollbar: {
							vertical: "auto",
							horizontal: "auto",
							useShadows: false,

							verticalHasArrows: false,
							horizontalHasArrows: false,
							horizontalScrollbarSize: 10,
							verticalScrollbarSize: 10,
						},
						scrollBeyondLastLine: false,
						lineNumbersMinChars: 2,
						lineDecorationsWidth: 0,
						// Editor Behavior
						contextmenu: true,
						dragAndDrop: true,
						copyWithSyntaxHighlighting: true,
						autoClosingComments: "always",
						folding: true,
						cursorStyle: "line",
						cursorWidth: 2,
						cursorBlinking: "expand",
						smoothScrolling: true,
						mouseWheelZoom: true,
						// Theme
						theme,
					}}
				/>
			</Suspense>
		</div>
	);
}

EditorMain.displayName = "EditorMain";

export default EditorMain;
