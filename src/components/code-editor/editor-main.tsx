import { lazy, Suspense } from "react";
import type { Monaco } from "@monaco-editor/react";
import { useEditorStore } from "@/store/editor";
import { themes } from "@/themes";
import { editor } from "monaco-editor";
import { useConfigStore } from "@/store/config";
import { Loader } from "lucide-react";
import * as monaco from "monaco-editor";
import { extraLib } from "@/consts/extraLib";
import { useAIConfigStore } from "@/store/aiConfig";
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export function EditorMain() {
	// useEditorStore
	const code = useEditorStore((state) => state.code);
	const setMonaco = useEditorStore((state) => state.setMonaco);
	const setEditorRef = useEditorStore((state) => state.setEditorRef);
	const updateTabCode = useEditorStore((state) => state.updateTabCode);
	const activeTabId = useEditorStore((state) => state.activeTabId);
	const theme = useEditorStore((state) => state.theme);
	const runCode = useEditorStore((state) => state.runCode);
	const running = useEditorStore((state) => state.running);
	const newTab = useEditorStore((state) => state.newTab);
	// useConfigStore
	const fontSize = useConfigStore((state) => state.fontSize);
	const wordWrap = useConfigStore((state) => state.wordWrap);
	const lineNumbers = useConfigStore((state) => state.lineNumbers);
	const fontFamily = useConfigStore((state) => state.fontFamily);
	const minimap = useConfigStore((state) => state.minimap);
	const whiteSpace = useConfigStore((state) => state.whiteSpace);
	const toogleChat = useAIConfigStore((state) => state.toggleChat);
	const onEditorReady = (
		editor: editor.IStandaloneCodeEditor,
		monacoInstance: Monaco,
	) => {
		setMonaco(monacoInstance);
		setEditorRef(editor);
	};

	const handleEditorDidMount = async (
		editor: editor.IStandaloneCodeEditor,
		monacoInstance: Monaco,
	) => {
		// Define all themes
		for (const [key, value] of Object.entries(themes)) {
			monacoInstance.editor.defineTheme(key, value.monaco);
		}
		monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
			allowNonTsExtensions: true,
			moduleResolution:
				monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
			noEmit: true,
		});
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
			toogleChat,
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
			monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyD,
			newTab,
		);
		editor.addAction({
			id: "new-tab",
			label: "New Tab",
			keybindings: [
				monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyD,
			],
			run: newTab,
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
		monacoInstance.languages.registerCompletionItemProvider("javascript", {
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
		onEditorReady(editor, monacoInstance);
	};

	return (
		<div className="relative h-full" translate="no">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full bg-background">
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
					value={code}
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

						// Auto-formatting & Indentation
						autoIndent: "full",
						formatOnPaste: true,
						formatOnType: true,
						guides: {
							bracketPairs: true,
							indentation: true,
						},

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
						renderLineHighlight: "all",
						renderValidationDecorations: "on",
						renderWhitespace: whiteSpace ? "all" : "selection",
						"semanticHighlighting.enabled": true,

						// Editor UI Features
						minimap: {
							enabled: minimap,
							scale: 0.4,
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
							arrowSize: 30,
						},
						scrollBeyondLastLine: false,

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
