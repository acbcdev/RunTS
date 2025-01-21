import { useEffect } from "react";
import { EditorTopBar } from "./editor-top-bar";
import { EditorTabs } from "./editor-tabs";
import { EditorMain } from "./editor-main";
import { useDebounce } from "@uidotdev/usehooks";
import { useEditorStore } from "@/store/editor";
import { useConfigStore } from "@/store/config";
import { useHotkeys } from "react-hotkeys-hook";

import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Console } from "@/components/code-editor/console";
import { Updates } from "@/components/updates";
import { updateChangeTheme } from "@/lib/utils";
import { Chat } from "@/components/AI/Chat";

export function CodeEditor() {
	const { tabs, activeTabId, theme, getCurrentTheme, runCode } =
		useEditorStore();
	const { layout, refreshTime } = useConfigStore();
	const activeTab = tabs.find((tab) => tab.id === activeTabId);
	const debouncedCode = useDebounce(
		activeTab?.code || "",
		refreshTime || 60000 * 10,
	);
	useHotkeys("ctrl+q", () => {
		runCode();
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const currentTheme = getCurrentTheme();
		updateChangeTheme(currentTheme);
	}, [theme]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		runCode();
	}, [debouncedCode]);
	if (!activeTab) return null;

	return (
		<main className="flex flex-col h-screen bg-background " translate="no">
			<EditorTopBar />
			<EditorTabs />
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<ResizablePanel
					collapsible={true}
					maxSize={45}
					collapsedSize={15}
					// defaultSize={30}
					minSize={0}
				>
					<Chat />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={100}>
					<ResizablePanelGroup direction={layout}>
						<ResizablePanel defaultSize={60} minSize={30}>
							<EditorMain />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={40} minSize={20}>
							<Console />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
			<Updates />
		</main>
	);
}
