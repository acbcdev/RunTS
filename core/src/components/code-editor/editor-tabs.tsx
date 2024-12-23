import { Plus, X } from "lucide-react";
import { Button } from "@core/components/ui/button";
import { ScrollArea } from "@core/components/ui/scroll-area";
import { Tooltip } from "@core/components/ui/tooltip";
import { useEditorStore } from "@core/store/editor";
import { cn } from "@core/lib/utils";

export function EditorTabs() {
  const {
    tabs,
    activeTabId,
    editorRef,
    addTab,
    updateTabCode,
    removeTab,
    setActiveTab,
    getCurrentTheme,
    changeNameTab,
    currentTab,
  } = useEditorStore();

  const currentTheme = getCurrentTheme();
  const handleActiveTabChange = (tabId: string) => {
    setActiveTab(tabId);
    updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || "");
    editorRef?.focus();
  };
  const handleAddTab = () => {
    addTab({
      name: `untitled-${Date.now().toString().slice(-4)}.ts`,
      language: "typescript",
      code: "// Start coding here\n",
      logs: [],
      logFormated: "",
    });
  };
  
  const handleRightClick = (tabId: string) => {
    if (activeTabId !== tabId) return
      
    const spanElement = document.querySelector(".underline");
    
    if (spanElement) {
      spanElement.contentEditable = "true";

      const range = document.createRange();
      const selection = window.getSelection();

      range.setStart(spanElement.firstChild, 0);
      range.setEnd(spanElement.firstChild, spanElement.textContent.length - 3);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    const tabTextContent = event.currentTarget.textContent;

    if (!tabTextContent) {
      const { name } = currentTab(activeTabId);
      event.currentTarget.textContent = name
      return;
    }

    const tsFile = tabTextContent.endsWith(".ts") || tabTextContent.endsWith(".js");
    const [nameTab, extension] = tabTextContent.split(".");

    let changeName: string = tabTextContent;
    if (!tsFile) changeName = `${nameTab}.ts`;

    changeNameTab(activeTabId, changeName);
    event.currentTarget.contentEditable = "false";
    event.currentTarget.textContent = changeName;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div
      className="flex items-center border-b"
      style={{
        borderColor: currentTheme.ui.border,
        backgroundColor: currentTheme.ui.header,
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
                activeTabId === tab.id && "bg-[var(--tab-active)]",
              )}
              style={
                {
                  borderColor: currentTheme.ui.border,
                  backgroundColor:
                    activeTabId === tab.id
                      ? currentTheme.ui.background
                      : "transparent",
                  "--tab-active": currentTheme.ui.background,
                  "--tab-hover": currentTheme.ui.hover,
                } as React.CSSProperties
              }
              onClick={() => handleActiveTabChange(tab.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleRightClick(tab.id);
              }}
              onMouseEnter={(e) => {
                if (activeTabId !== tab.id) {
                  e.currentTarget.style.backgroundColor = currentTheme.ui.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTabId !== tab.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span
                className={cn(
                  `${tab.id === activeTabId ? "underline" : ""}`,
                  "outline-none focus:text-sm",
                )}
                style={{ color: currentTheme.ui.foreground }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                spellcheck="false"
              >
                {tab.name}
              </span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  translate="no"
                  className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
                  style={
                    {
                      "--hover-bg": currentTheme.ui.hover,
                      color: currentTheme.ui.muted,
                    } as React.CSSProperties
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
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
          style={
            {
              color: currentTheme.ui.foreground,
              "--hover-color": currentTheme.ui.warning,
              "--hover-bg": currentTheme.ui.hover,
            } as React.CSSProperties
          }
          onClick={handleAddTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  );
}
