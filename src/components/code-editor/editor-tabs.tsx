import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip } from "@/components/ui/tooltip";
import { useEditorStore } from "@/store/editor";
import { cn } from "@/lib/utils";

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
    });
  };

  const handleChangeName = (tabId: string) => {
    if (activeTabId !== tabId) return

    const spanElement = document.querySelector(".underline") as HTMLSpanElement;

    if (spanElement) {
      spanElement.contentEditable = "true";
      spanElement.classList.add(`outline-[${currentTheme.ui.accent}]`);
      const range = document.createRange();
      const selection = window.getSelection();
      if (!selection) return;
      if (!spanElement.firstChild || !spanElement.textContent) return;
      range.setStart(spanElement.firstChild, 0);
      range.setEnd(spanElement.firstChild, spanElement.textContent.length - 3);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    const tabTextContent = event.currentTarget.textContent;

    if (!tabTextContent) {
      const tab = currentTab(activeTabId);
      if (!tab) return;
      event.currentTarget.textContent = tab.name;
      return;
    }

    const tsFile = tabTextContent.endsWith(".ts") || tabTextContent.endsWith(".js");
    const [nameTab] = tabTextContent.split(".");

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
              className="group flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer transition-colors "
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
              onDoubleClick={() => handleChangeName(tab.id)}
              onClick={() => handleActiveTabChange(tab.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleChangeName(tab.id);
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
                  `${tab.id === activeTabId ? "underline" : ""}  focus:outline-red`,
                )}
                style={{ color: currentTheme.ui.foreground }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                spellCheck="false"
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
