// import { useEffect } from 'react'
// import { EditorTopBar } from './editor-top-bar'
// import { EditorTabs } from './editor-tabs'
// import { EditorMain } from './editor-main'
// import { Terminal } from './terminal'
// import { useToast } from "@/components/ui/use-toast"
// import { useDebounce } from '@uidotdev/usehooks'
// import type { Monaco } from '@monaco-editor/react'
// import { useEditorStore } from '@/store/editor'
// import { editor } from 'monaco-editor'

// export function CodeEditor() {
//   const {
//     tabs,
//     activeTabId,
//     output,
//     theme,
//     fontSize,
//     wordWrap,
//     setMonaco,
//     setEditorRef,
//     updateTabCode,
//     runCode,
//     resetCode,
//     clearConsole,
//     setTheme,
//     setFontSize,
//     setWordWrap
//   } = useEditorStore()

//   const activeTab = tabs.find(tab => tab.id === activeTabId)
//   const { toast } = useToast()
//   const debouncedCode = useDebounce(activeTab?.code || '', 700)

//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   useEffect(() => {
//     runCode()
//   }, [debouncedCode, runCode])

//   const handleEditorReady = (editor: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
//     setMonaco(monacoInstance)
//     setEditorRef(editor)
//   }

//   const handleReset = () => {
//     resetCode()
//     toast({
//       title: "Code reset",
//       description: "The editor has been reset to the default code.",
//       duration: 2000
//     })
//   }

//   const handleClear = () => {
//     clearConsole()
//     toast({
//       title: "Console cleared",
//       description: "The console output has been cleared.",
//       duration: 2000
//     })
//   }

//   if (!activeTab) return null

//   return (
//     <div className="h-screen flex flex-col bg-[#282c34] text-[#abb2bf]">
//       <EditorTopBar
//         onRun={runCode}
//         onReset={handleReset}
//         onClear={handleClear}
//         currentTheme={theme}
//         fontSize={fontSize}
//         wordWrap={wordWrap}
//         onThemeChange={setTheme}
//         onFontSizeChange={setFontSize}
//         onWordWrapChange={setWordWrap}
//       />
//       <EditorTabs />
//       <div className="flex flex-1">
//         <div className="w-3/5">
//           <EditorMain
//             code={activeTab.code}
//             language={activeTab.language}
//             output={output}
//             onCodeChange={(code) => updateTabCode(activeTab.id, code)}
//             onEditorReady={handleEditorReady}
//             theme={theme}
//             fontSize={fontSize}
//             wordWrap={wordWrap}
//           />
//         </div>
//         <div className="w-2/5 border-l border-[#3e4451]">
//           <Terminal output={output} />
//         </div>
//       </div>
//     </div>
//   )
// }