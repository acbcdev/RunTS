import { AnimatePresence, motion } from "motion/react";
import { lazy, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Chat } from "@/features/ai/chat/Chat";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { useDebounce } from "@/features/common/hooks/useDebounce";
import { ReloadPrompt } from "@/features/common/loader/ReloadPrompt";
import { useShortcuts } from "@/features/common/shortcuts/useShortcuts";
import { updateChangeTheme } from "@/features/common/utils/utils";
import {
	SIDES,
	useApparenceStore,
} from "@/features/settings/appearance-store/appearance";
import { useConfigStore } from "@/features/settings/config-store/config";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/features/ui/resizable";
import { useRun } from "../use-run/useRun";

const EditorMain = lazy(() => import("../editor-main/EditorMain"));
const EditorTabs = lazy(() => import("@/features/tabs/editor-tabs/EditorTabs"));
const EditorActions = lazy(() => import("../editor-actions/EditorActions"));
const Console = lazy(() => import("../console/Console"));
const EmptyState = lazy(() => import("../editor-main/EmptyState"));

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
	// biome-ignore lint/correctness/useExhaustiveDependencies
	useEffect(() => {
		const currentTheme = getCurrentTheme();
		updateChangeTheme(currentTheme);
	}, [theme]);

	// biome-ignore lint/correctness/useExhaustiveDependencies
	useEffect(() => {
		runCode();
	}, [debouncedCode]);

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
			className={`flex h-screen bg-background/85 ${side < SIDES.TOP ? "flex-row" : "flex-col"}`}
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
