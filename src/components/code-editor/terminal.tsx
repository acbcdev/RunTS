import { useEditorStore } from '@/store/editor'

import { lazy, Suspense, } from "react";

const MonacoEditor = lazy(() => import("@monaco-editor/react"))

export function Terminal() {
  const { getCurrentTheme, output, theme, fontSize, fontFamily } = useEditorStore()
  const currentTheme = getCurrentTheme()
  return (
    <div
      className="relative h-full"
      style={{ backgroundColor: currentTheme.ui.background }}
    >
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
          value={output.length === 0 ? '"Console output will appear here..."' : output.map(item => item.content).join('\n')}
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
            minimap: { enabled: false },
            readOnly: true,
            wordWrap: 'on',
            fontSize,
            automaticLayout: true,
            fontFamily,
            fontLigatures: true,
            glyphMargin: false,
            scrollBeyondLastLine: false,
            folding: true,
            bracketPairColorization: {
              enabled: true
            },
            codeLens: false,
            multiCursorLimit: 0,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            renderWhitespace: 'none',
            renderLineHighlight: 'all',
            selectionHighlight: false,
          }}
        />
      </Suspense>
    </div>
  )
}