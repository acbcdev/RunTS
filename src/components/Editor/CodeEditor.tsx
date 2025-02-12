import { EditorMain } from "@/components/Editor/EditorMain";
import { EditorTabs } from "@/components/Tabs/EditorTabs";
import { EditorTopBar } from "@/components/TopBar/EditorTopBar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDebounce } from "@/hooks/useDebounce";
import { useAIConfigStore } from "@/store/aiConfig";
import { useConfigStore } from "@/store/config";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Chat } from "@/components/AI/Chat";
import { Console } from "@/components/Editor/Console";
import { ReloadPrompt } from "@/components/ReloadPrompt";
import { useRun } from "@/hooks/useRun";
import { updateChangeTheme } from "@/lib/utils";
import { useApparenceStore } from "@/store/apparence";
import { useTabsStore } from "@/store/tabs";
import { useShallow } from "zustand/react/shallow";

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
	useHotkeys("ctrl+shift+d", () => newTab(), { preventDefault: true });

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
