import { useEffect } from "react";
import { EditorTopBar } from "@/components/code-editor/editor-top-bar";
import { EditorTabs } from "@/components/code-editor/editor-tabs";
import { EditorMain } from "@/components/code-editor/editor-main";
import { useDebounce } from "@/hooks/useDebounce";
import { useConfigStore } from "@/store/config";
import { useAIConfigStore } from "@/store/aiConfig";
import { useHotkeys } from "react-hotkeys-hook";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Console } from "@/components/code-editor/console";
import { updateChangeTheme } from "@/lib/utils";
import { Chat } from "@/components/AI/Chat";
import { useShallow } from "zustand/react/shallow";
import { useTabsStore } from "@/store/tabs";
import { useApparenceStore } from "@/store/apparence";
import { useRun } from "@/hooks/useRun";
import { ReloadPrompt } from "@/components/ReloadPrompt";

export function CodeEditor() {
	const { runCode } = useRun();
	// useConfigStore
	const refreshTime = useConfigStore(useShallow((state) => state.refreshTime));
	const { showChat, toggleChat } = useAIConfigStore(
		useShallow((state) => ({
			showChat: state.showChat,
			toggleChat: state.toggleChat,
		})),
	);
	// useTabsStore
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));

	const newTab = useTabsStore(useShallow((state) => state.newTab));
	const debouncedCode = useDebounce(getCurrentTab()?.code || "", refreshTime);
	// useApparenceStore
	const { radius, theme, layout, getCurrentTheme } = useApparenceStore(
		useShallow((state) => ({
			radius: state.radius,
			theme: state.theme,
			layout: state.layout,
			getCurrentTheme: state.getCurrentTheme,
		})),
	);
	useHotkeys("ctrl+q", runCode);
	useHotkeys("ctrl+b", () => toggleChat());
	useHotkeys("ctrl+shift+d", newTab, { preventDefault: true });

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
	if (!activeTabId) {
		return null;
	}
	return (
		<main className="flex flex-col h-screen bg-background " translate="no">
			<EditorTopBar />
			<EditorTabs />

			<ResizablePanelGroup direction="horizontal" className="flex-1">
				{showChat && <Chat />}
				<ResizablePanel defaultSize={100}>
					<ResizablePanelGroup direction={layout}>
						<ResizablePanel defaultSize={60}>
							<EditorMain />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={40}>
							<Console />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
			{/* <Updates /> */}
			<ReloadPrompt />
		</main>
	);
}
