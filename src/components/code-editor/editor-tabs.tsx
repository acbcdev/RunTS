import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip } from "@/components/ui/tooltip"
import { useEditorStore } from '@/store/editor'
import { cn } from '@/lib/utils'

export function EditorTabs() {
  const {
    tabs,
    activeTabId,
    editorRef,
    addTab,
    updateTabCode,
    removeTab,
    setActiveTab,
    getCurrentTheme
  } = useEditorStore()

  const currentTheme = getCurrentTheme()
  const handleActiveTabChange = (tabId: string) => {
    setActiveTab(tabId)
    updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || '')
    editorRef?.focus()
  }
  const handleAddTab = () => {
    addTab({
      name: `untitled-${tabs.length + 1}.ts`,
      language: 'typescript',
      code: '// Start coding here\n',
      logs: [],
    })
  }

  return (
    <div
      className="flex items-center border-b"
      style={{
        borderColor: currentTheme.ui.border,
        backgroundColor: currentTheme.ui.header
      }}
    >
      <ScrollArea className="max-w-[calc(100%-32px)]">
        <div className="flex">
          {tabs.map((tab) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={tab.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer transition-colors",
                activeTabId === tab.id && "bg-[var(--tab-active)]"
              )}
              style={{
                borderColor: currentTheme.ui.border,
                backgroundColor: activeTabId === tab.id ? currentTheme.ui.background : 'transparent',
                '--tab-active': currentTheme.ui.background,
                '--tab-hover': currentTheme.ui.hover
              } as React.CSSProperties}
              onClick={() => handleActiveTabChange(tab.id)}
              onMouseEnter={(e) => {
                if (activeTabId !== tab.id) {
                  e.currentTarget.style.backgroundColor = currentTheme.ui.hover
                }
              }}
              onMouseLeave={(e) => {
                if (activeTabId !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ color: currentTheme.ui.foreground }}>{tab.name}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
                  style={{
                    '--hover-bg': currentTheme.ui.hover,
                    color: currentTheme.ui.muted
                  } as React.CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTab(tab.id)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <Tooltip content="New tab">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          style={{
            color: currentTheme.ui.foreground,
            '--hover-color': currentTheme.ui.warning,
            '--hover-bg': currentTheme.ui.hover
          } as React.CSSProperties}
          onClick={handleAddTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  )
}