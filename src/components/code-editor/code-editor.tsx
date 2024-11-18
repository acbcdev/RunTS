import { useEffect } from "react";
import { EditorTopBar } from "./editor-top-bar";
import { EditorTabs } from "./editor-tabs";
import { EditorMain } from "./editor-main";

import { useDebounce } from "@uidotdev/usehooks";
import { useEditorStore } from "@/store/editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Terminal } from "./terminal";

export function CodeEditor() {
  const {
    tabs,
    activeTabId,
    refreshTime,
    getCurrentTheme,
    runCode,
  } = useEditorStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const debouncedCode = useDebounce(
    activeTab?.code || "",
    refreshTime ?? 100000,
  );
  const currentTheme = getCurrentTheme();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    runCode();
  }, [debouncedCode]);
  if (!activeTab) return null;

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundColor: currentTheme.ui.background,
        color: currentTheme.ui.foreground,
      }}
    >
      <EditorTopBar />
      <EditorTabs />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <EditorMain />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <Terminal />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
