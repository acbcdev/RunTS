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
import { lazy, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

const EditorMain = lazy(() => import("@/components/editor/EditorMain"));
const EditorTabs = lazy(() => import("@/components/tabs/EditorTabs"));
const EditorActions = lazy(() => import("@/components/actions/EditorActions"));
const Console = lazy(() => import("@/components/editor/Console"));
const EmptyState = lazy(() => import("@/components/editor/EmptyState"));

type positionSettings = {
	tooltip: "left" | "right" | "top" | "bottom";
	className: string;
};

const SettingsBySide: Record<number, positionSettings> = {
	[SIDES.LEFT]: { tooltip: "right", className: "border-r" },
	[SIDES.RIGHT]: { tooltip: "left", className: "border-l order-2" },
	[SIDES.TOP]: { tooltip: "bottom", className: "border-b" },
	[SIDES.BOTTOM]: { tooltip: "top", className: "border-t order-2" },
};

export function CodeEditor() {
	useShortcuts();
	const { runCode } = useRun();
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const tab = getCurrentTab();
	const refreshTime = useConfigStore(useShallow((state) => state.refreshTime));
	// useTabsStore

	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));

	const debouncedCode = useDebounce(tab?.code || "", refreshTime);
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

	const direction = useMemo(() => {
		return side === SIDES.LEFT || side === SIDES.RIGHT ? "column" : "row";
	}, [side]);

	const tooltipSide = useMemo(() => {
		return SettingsBySide[side].tooltip;
	}, [side]);
	const className = useMemo(() => {
		return SettingsBySide[side].className;
	}, [side]);
	return (
		<main
			className={`flex h-screen bg-background/80 ${side < SIDES.TOP ? "flex-row" : "flex-col"}`}
			translate="no"
		>
			<EditorActions
				direction={direction}
				className={className}
				tooltipSide={tooltipSide}
			/>

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
						>
							<Chat />
						</motion.div>
					)}
				</AnimatePresence>

				<ResizablePanel defaultSize={100}>
					<EditorTabs />
					{tab ? (
						<ResizablePanelGroup direction={layout}>
							<ResizablePanel defaultSize={60}>
								<EditorMain tab={tab} />
							</ResizablePanel>
							<ResizableHandle withHandle className="w-1" />
							<ResizablePanel defaultSize={40}>
								<Console tab={tab} />
							</ResizablePanel>
						</ResizablePanelGroup>
					) : (
						<EmptyState />
					)}
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* <Updates /> */}
			<ReloadPrompt />
		</main>
	);
}
export default CodeEditor;
