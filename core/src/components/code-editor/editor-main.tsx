import { lazy, Suspense } from "react";
import type { Monaco } from "@monaco-editor/react";
import { useEditorStore } from "@core/store/editor";
import { themes } from "@core/themes";
import { editor, } from "monaco-editor";
import { useConfigStore } from "@core/store/config";
import { Loader2Icon } from "lucide-react";
import * as monaco from 'monaco-editor'
import { extraLib } from "@core/consts/extraLib";
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export function EditorMain() {
  const {
    code,
    setMonaco,
    setEditorRef,
    updateTabCode,
    activeTabId,
    getCurrentTheme,
    theme,
    running,
  } = useEditorStore();
  const { fontSize, wordWrap, lineNumbers, fontFamily, minimap, whiteSpace } =
    useConfigStore();
  const currentTheme = getCurrentTheme();

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
      moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
      noEmit: true
    })

    monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(extraLib, 'file:///custom.d.ts');
    monacoInstance.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: '.log', // La palabra que activa el autocompletado
            kind: monaco.languages.CompletionItemKind.Snippet, // Tipo de sugerencia
            documentation: 'Insert a console.log() statement',
            insertText: 'console.log($1);', // Texto que se inserta
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: editor.getModel().getFullModelRange(), // Rango para reemplazar
          },
          {
            label: 'console.', // La palabra que activa el autocompletado
            kind: monaco.languages.CompletionItemKind.Snippet, // Tipo de sugerencia
            documentation: 'Insert a console.log() statement',
            insertText: 'console.log($1);', // Texto que se inserta
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: editor.getModel().getFullModelRange(), // Rango para reemplazar
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
          <div
            className="flex items-center justify-center h-full"
            style={{ backgroundColor: currentTheme.ui.background }}
          >
            <div
              className="text-lg animate-pulse"
              style={{ color: currentTheme.ui.muted }}
            >
              Loading editor...
            </div>
          </div>
        }
      >
        {running && (
          <Loader2Icon className="absolute z-10 text-white animate-spin right-6 top-2 size-10" />
        )}
        <MonacoEditor
          height="100%"
          defaultLanguage={"typescript"}
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
              multipleDefinitions: "goto"
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
              scale: 0.4
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
              arrowSize: 30
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
