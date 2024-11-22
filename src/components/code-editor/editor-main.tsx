import { lazy, Suspense } from 'react';
import type { Monaco } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editor';
import { themes } from '@/themes';
import type { editor } from 'monaco-editor';



const MonacoEditor = lazy(() => import("@monaco-editor/react"))

export function EditorMain() {
  const { getCurrentTheme, fontFamily, lineNumbers, code, theme, fontSize, wordWrap, setMonaco, setEditorRef, updateTabCode, activeTabId } = useEditorStore()
  const currentTheme = getCurrentTheme()



  const onEditorReady = (editor: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    setMonaco(monacoInstance)
    setEditorRef(editor)
  }

  const handleEditorDidMount = async (editor: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
    // Define all themes
    for (const [key, value] of Object.entries(themes)) {
      monacoInstance.editor.defineTheme(key, value.monaco)
    }

    monacoInstance.editor.setTheme(theme)
    setEditorRef(editor);
    onEditorReady(editor, monacoInstance)



    // Add decorations for console outputs
    // if (editor && currentTab(activeTabId)?.logs.length > 0) {
    //   const decorations: editor.IModelDeltaDecoration[] = currentTab(activeTabId)?.logs.map(item => ({
    //     range: new monacoInstance.Range(item.line, 1, item.line, 1),
    //     options: {
    //       isWholeLine: true,
    //       className: 'console-output-line',
    //       marginClassName: 'console-output-margin'
    //     }
    //   }))
    //   editor.createDecorationsCollection(decorations)
    // }
  }


  return (
    <div className="relative h-full">
      <Suspense fallback={
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
      }>
        <MonacoEditor
          height="100%"
          defaultLanguage={'typescript'}
          value={code}
          onChange={(value) => updateTabCode(activeTabId, value || '')}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            autoIndent: 'full',
            codeLens: true,
            showDeprecated: true,
            showUnused: true,
            autoClosingComments: 'always',
            colorDecorators: true,
            showFoldingControls: "always",
            contextmenu: true,
            inlineSuggest: { enabled: true, },
            theme,
            dragAndDrop: true,
            copyWithSyntaxHighlighting: true,
            suggest: {
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showDeprecated: true
            },
            trimAutoWhitespace: true,
            fontFamily,
            fontLigatures: true,
            fontSize,
            tabSize: 2,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: true, scale: 0.4, },
            lineNumbers: lineNumbers ? 'on' : 'off',
            glyphMargin: true,
            scrollBeyondLastLine: false,
            folding: true,
            bracketPairColorization: {
              enabled: true
            },
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            padding: {
              top: 12,
              bottom: 12
            },
            cursorStyle: 'line',
            cursorWidth: 2,
            cursorBlinking: 'expand',
            smoothScrolling: true,
            mouseWheelZoom: true,
            renderLineHighlight: 'all',
            renderWhitespace: 'selection',
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />
      </Suspense>

    </div>
  )
}

