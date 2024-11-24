import { Play, Plus, Minus, RotateCcw, Download, Copy, Trash2, Columns, Rows } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useEditorStore } from '@/store/editor'
import { EditorSettingsDialog } from '@/components/code-editor/editor-setting-dialog'
import { useConfigStore } from '@/store/config'
import { memo } from 'react'

export const EditorTopBar = memo(function EditorTopBar() {
  const { toast } = useToast()
  const { code, editorRef, monaco, getCurrentTheme, resetCode, clearConsole, runCode, activeTabId } = useEditorStore()
  const { layout, setLayout, setFontSize } = useConfigStore()
  const currentTheme = getCurrentTheme()
  const handleReset = () => {
    resetCode()
    toast({
      title: "Code reset",
      description: "The editor has been reset to the default code.",
      duration: 2000
    })
  }
  const toogleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal")
  }
  const handleClear = () => {
    clearConsole(activeTabId)
    toast({
      title: "Console cleared",
      description: "The console output has been cleared.",
      duration: 2000
    })
  }
  const increaseFontSize = () => {
    if (editorRef && monaco) {
      const currentFontSize = editorRef.getOption(monaco.editor.EditorOption.fontSize)
      setFontSize(currentFontSize + 2)
    }
  }

  const decreaseFontSize = () => {
    if (editorRef && monaco) {
      const currentFontSize = editorRef.getOption(monaco.editor.EditorOption.fontSize)
      if (currentFontSize > 8) {
        setFontSize(currentFontSize - 2)
      }
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied!",
      description: "The code has been copied to your clipboard.",
      duration: 2000
    })
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code.ts'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Code downloaded!",
      description: "The code has been downloaded as 'code.js'",
      duration: 2000
    })
  }

  return (
    <div
      className={"flex items-center justify-between p-2 border-b "}
      style={{
        borderColor: currentTheme.ui.border,
        backgroundColor: currentTheme.ui.header
      }}
    >
      <div className="flex items-center space-x-2">
        <Tooltip content="Decrease font size">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={decreaseFontSize}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Increase font size">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={increaseFontSize}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Run code (Ctrl+Enter)">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.success,
              '--hover-color': currentTheme.ui.success,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={runCode}
          >
            <Play className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Toogle layout">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
            } as React.CSSProperties}
            onClick={toogleLayout}
          >
            {layout === 'horizontal' ? <Columns className="size-4" /> : <Rows className="size-4" />}
          </Button>
        </Tooltip>
        <EditorSettingsDialog />
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip content="Reset to default code">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Copy code">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={copyCode}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Download code">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={downloadCode}
          >
            <Download className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Clear console">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
            onClick={handleClear}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
})