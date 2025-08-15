import { ReloadPrompt } from "@/components/ReloadPrompt";
import { Chat } from "@/components/ai/Chat";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDebounce } from "@/hooks/useDebounce";
import { useRun } from "@/hooks/useRun";
import { updateChangeTheme } from "@/lib/utils";
import { useAIConfigStore } from "@/store/aiConfig";
import { useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { useTabsStore } from "@/store/tabs";
import { AnimatePresence, motion } from "motion/react";
import { lazy, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";

const EditorMain = lazy(() => import("@/components/editor/EditorMain"));
const EditorTabs = lazy(() => import("@/components/tabs/EditorTabs"));
const EditorTopBar = lazy(() => import("@/components/topBar/EditorTopBar"));
const Console = lazy(() => import("@/components/editor/Console"));
export function CodeEditor() {
	const { runCode } = useRun();

	const refreshTime = useConfigStore(useShallow((state) => state.refreshTime));
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

	const { showChat, toggleChat } = useAIConfigStore(
		useShallow((state) => ({
			showChat: state.showChat,
			toggleChat: state.toggleChat,
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
		<main className="flex flex-col h-screen bg-background/80 " translate="no">
			<ResizablePanelGroup direction="horizontal">
				<AnimatePresence mode="wait">
					{showChat && (
						<motion.div
							key="chat"
							initial={{ opacity: 0, x: -200, width: 0 }}
							animate={{
								opacity: 1,
								x: 0,
								width: "auto",
							}}
							exit={{
								x: -200,
								width: 0,
								opacity: 0,
							}}
							className="h-full"
						>
							<Chat />
						</motion.div>
					)}
				</AnimatePresence>

				<ResizablePanel defaultSize={100}>
					<EditorTopBar />
					<EditorTabs />
					<ResizablePanelGroup direction={layout}>
						<ResizablePanel defaultSize={60}>
							<EditorMain />
						</ResizablePanel>
						<ResizableHandle withHandle className="w-1" />
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
export default CodeEditor;
