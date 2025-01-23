import { useEffect } from "react";
import { EditorTopBar } from "./editor-top-bar";
import { EditorTabs } from "./editor-tabs";
import { EditorMain } from "./editor-main";
import { useDebounce } from "@uidotdev/usehooks";
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

export function CodeEditor() {
	// useEditorStore
	const tabs = useEditorStore((state) => state.tabs);
	const activeTabId = useEditorStore((state) => state.activeTabId);
	const theme = useEditorStore((state) => state.theme);
	const getCurrentTheme = useEditorStore((state) => state.getCurrentTheme);
	const runCode = useEditorStore((state) => state.runCode);
	// useConfigStore
	const layout = useConfigStore((state) => state.layout);
	const radius = useConfigStore((state) => state.radius);
	const refreshTime = useConfigStore((state) => state.refreshTime);
	const activeTab = tabs.find((tab) => tab.id === activeTabId);
	const showChat = useAIConfigStore((state) => state.showChat);
	const toggleChat = useAIConfigStore((state) => state.toggleChat);

	const debouncedCode = useDebounce(
		activeTab?.code || "",
		refreshTime || 60000 * 10,
	);
	useHotkeys("ctrl+q", () => {
		runCode();
	});
	useHotkeys("ctrl+b", () => {
		toggleChat();
	});

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
				{/* <ResizablePanel */}
				{/* // onClick={() => setChat((prev) => (prev === 0 ? 30 : 0))}
						// collapsedSize={15}
						maxSize={chatSize}
						defaultSize={chatSize}
						minSize={chatSize} */}
				{/* // > */}
				{showChat && <Chat />}
				{/* </ResizablePanel> */}
				{/* <ResizableHandle withHandle /> */}

				{/* <ResizablePanel
				// onClick={() => setChat((prev) => (prev === 0 ? 30 : 0))}
				// collapsedSize={15}
				// maxSize={chatSize}
				// defaultSize={chatSize}
				// minSize={chatSize}
				>
					<Chat />
				</ResizablePanel> */}
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
