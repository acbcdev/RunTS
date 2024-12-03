import { useEffect } from "react";
import { EditorTopBar } from "./editor-top-bar";
import { EditorTabs } from "./editor-tabs";
import { EditorMain } from "./editor-main";
import { useDebounce } from "@uidotdev/usehooks";
import { useEditorStore } from "@/store/editor";
import { useConfigStore } from "@/store/config";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Console } from "@/components/code-editor/console";

export function CodeEditor() {
  const {
    tabs,
    activeTabId,
    theme,
    getCurrentTheme,
    runCode,
  } = useEditorStore();
  const { layout, refreshTime } = useConfigStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const debouncedCode = useDebounce(
    activeTab?.code || "",
    refreshTime || 60000 * 10);
  const currentTheme = getCurrentTheme();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    metaThemeColor?.setAttribute('content', currentTheme.ui.header);
  }, [theme])
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
      translate="no"
    >
      <EditorTopBar />
      <EditorTabs />
      <ResizablePanelGroup direction={layout} className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <EditorMain />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <Console />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
