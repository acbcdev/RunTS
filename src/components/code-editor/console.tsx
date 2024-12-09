import { useConfigStore } from '@/store/config';
import { useEditorStore } from '@/store/editor'
import { lazy, Suspense, } from "react";

const MonacoEditor = lazy(() => import("@monaco-editor/react"))

export function Console() {
  const { getCurrentTheme, currentTab, activeTabId, theme } = useEditorStore()
  const { fontSize, fontFamily } = useConfigStore()
  const currentTheme = getCurrentTheme()

  return (
    <div
      className="relative h-full"
      translate='no'
      style={{ backgroundColor: currentTheme.ui.background }}>
      <Suspense fallback={
        <div
          className="flex items-center justify-center h-full"
          style={{ backgroundColor: currentTheme.ui.background }}
        >
          <div
            className="text-lg animate-pulse"
            style={{ color: currentTheme.ui.muted }}
          >
            Loading Terminal...
          </div>
        </div>
      }>

        <MonacoEditor
          value={currentTab(activeTabId)?.logs.map(({ content }) => content).join('\n')}
          language='typescript'
          theme={theme}
          beforeMount={(monaco) => {
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
              noSuggestionDiagnostics: true,
            });
          }}
          options={{
            lineNumbers: 'off',
            language: 'javascript',
            scrollbar: {
              horizontal: 'auto',
              vertical: 'auto',

            },
            minimap: { enabled: false },
            readOnly: true,
            wordWrap: 'on',
            padding: {
              top: 4,
              bottom: 4,
            },
            fontSize,
            automaticLayout: true,
            fontFamily,
            fontLigatures: true,
            glyphMargin: false,
            scrollBeyondLastLine: false,
            folding: true,
            bracketPairColorization: {
              enabled: false
            },
            cursorStyle: 'block',
            cursorBlinking: 'expand',
            codeLens: false,
            multiCursorLimit: 0,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            renderWhitespace: 'selection',

            renderLineHighlight: 'none',
            selectionHighlight: false,
          }}
        />

      </Suspense>
    </div>
  )
}