import { useEffect } from "react";
import { EditorTopBar } from "./editor-top-bar";
import { EditorTabs } from "./editor-tabs";
import { EditorMain } from "./editor-main";
import { useDebounce } from "@/hooks/useDebounce";
import { useEditorStore } from "@/store/editor";
import { useConfigStore } from "@/store/config";
import { useAIConfigStore } from "@/store/aiConfig";
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
import { useShallow } from "zustand/react/shallow";

export function CodeEditor() {
	// useEditorStore
	const { tabs, activeTabId, theme, getCurrentTheme, runCode, newTab } =
		useEditorStore(
			useShallow((state) => ({
				tabs: state.tabs,
				activeTabId: state.activeTabId,
				theme: state.theme,
				getCurrentTheme: state.getCurrentTheme,
				runCode: state.runCode,
				newTab: state.newTab,
			})),
		);

	// useConfigStore
	const { layout, radius, refreshTime } = useConfigStore(
		useShallow((state) => ({
			layout: state.layout,
			radius: state.radius,
			refreshTime: state.refreshTime,
		})),
	);
	const activeTab = tabs.find((tab) => tab.id === activeTabId);
	const { showChat, toggleChat } = useAIConfigStore(
		useShallow((state) => ({
			showChat: state.showChat,
			toggleChat: state.toggleChat,
		})),
	);

	const debouncedCode = useDebounce(activeTab?.code || "", refreshTime);
	useHotkeys("ctrl+q", runCode);
	useHotkeys("ctrl+b", () => toggleChat());
	useHotkeys("ctrl+d", newTab, { preventDefault: true });
	useEffect(() => {
		document.documentElement.style.setProperty("--radius", `${radius}rem`);
	}, [radius]);
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
				{showChat && <Chat />}
				<ResizablePanel defaultSize={100}>
					<ResizablePanelGroup direction={layout}>
						<ResizablePanel defaultSize={60} minSize={30}>
							<EditorMain />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={40} minSize={1}>
							<Console />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
			<Updates />
		</main>
	);
}
