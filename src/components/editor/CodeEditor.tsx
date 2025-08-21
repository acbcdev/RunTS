import { ReloadPrompt } from "@/components/ReloadPrompt";
import { Chat } from "@/components/ai/Chat";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useDebounce } from "@/hooks/useDebounce";
import { useRun } from "@/hooks/useRun";
import { useShortcuts } from "@/hooks/useShortcuts";
import { updateChangeTheme } from "@/lib/utils";
import { useAIConfigStore } from "@/store/aiConfig";
import { SIDES, useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { useTabsStore } from "@/store/tabs";
import { AnimatePresence, motion } from "motion/react";
import { lazy, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const EditorMain = lazy(() => import("@/components/editor/EditorMain"));
const EditorTabs = lazy(() => import("@/components/tabs/EditorTabs"));
const EditorActions = lazy(() => import("@/components/topBar/EditorActions"));
const Console = lazy(() => import("@/components/editor/Console"));
export function CodeEditor() {
	useShortcuts();
	const { runCode } = useRun();

	const refreshTime = useConfigStore(useShallow((state) => state.refreshTime));
	// useTabsStore
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);

	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));

	const debouncedCode = useDebounce(getCurrentTab()?.code || "", refreshTime);
	const { radius, theme, layout, getCurrentTheme } = useApparenceStore(
		useShallow((state) => ({
			radius: state.radius,
			theme: state.theme,
			layout: state.layout,
			getCurrentTheme: state.getCurrentTheme,
		})),
	);
	const side = useApparenceStore(useShallow((state) => state.side));
	const showChat = useAIConfigStore(useShallow((state) => state.showChat));

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
		<main
			className={`flex h-screen bg-background/80 ${side < SIDES.TOP ? "flex-row" : "flex-col"}`}
			translate="no"
		>
			{(side === SIDES.LEFT || side === SIDES.TOP) && (
				<EditorActions
					direction={side === SIDES.LEFT ? "column" : "row"}
					className={side === SIDES.LEFT ? "border-l" : "border-t"}
					tooltipSide={side === SIDES.LEFT ? "right" : "bottom"}
				/>
			)}

			<ResizablePanelGroup direction="horizontal">
				<AnimatePresence mode="wait">
					{showChat && (
						<motion.div
							key="chat"
							initial={{ opacity: 0, x: -300, width: 0, scaleX: 0.5 }}
							animate={{
								opacity: 1,
								scaleX: 1,
								x: 0,
								width: "auto",
							}}
							exit={{
								x: -300,
								width: 0,
								opacity: 0,
								scaleX: 0.5,
							}}
							transition={{ duration: 0.2, ease: "easeInOut" }}
							className="h-full"
						>
							<Chat />
						</motion.div>
					)}
				</AnimatePresence>

				<ResizablePanel defaultSize={100}>
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
			{(side === SIDES.RIGHT || side === SIDES.BOTTOM) && (
				<EditorActions
					direction={side === SIDES.RIGHT ? "column" : "row"}
					className={side === SIDES.RIGHT ? "border-l" : "border-t"}
					tooltipSide={side === SIDES.RIGHT ? "left" : "top"}
				/>
			)}

			{/* <Updates /> */}
			<ReloadPrompt />
		</main>
	);
}
export default CodeEditor;
