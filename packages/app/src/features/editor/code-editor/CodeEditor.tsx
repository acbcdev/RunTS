import { lazy, useEffect, useId, useLayoutEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Chat } from "@/features/ai/chat/Chat";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { useResizePanelSizes } from "@/features/common/hooks/useResizePanelSizes";
import { ReloadPrompt } from "@/features/common/loader/ReloadPrompt";
import { useShortcuts } from "@/features/common/shortcuts/useShortcuts";
import {
	SIDES,
	useApparenceStore,
} from "@/features/settings/appearance-store/appearance";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/features/ui/resizable";
import { langFromName } from "../language/langFromName";
import { useEditorSession } from "../use-editor-session";

const EditorTabs = lazy(() => import("@/features/tabs/editor-tabs/EditorTabs"));
const EditorActions = lazy(() => import("../editor-actions/EditorActions"));
const EditorLayout = lazy(() => import("../editor-layout/EditorLayout"));
const EmptyState = lazy(() => import("../editor-main/EmptyState"));

const CHAT_MIN_SIZE = { width: 480, height: 0 };

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
	const { tab } = useEditorSession();
	const { radius, theme, applyTheme } = useApparenceStore(
		useShallow((state) => ({
			radius: state.radius,
			theme: state.theme,
			applyTheme: state.applyTheme,
		})),
	);
	const side = useApparenceStore(useShallow((state) => state.side));
	const showChat = useAIConfigStore(useShallow((state) => state.showChat));
	const workspaceId = useId();
	const { width: chatMinSize } = useResizePanelSizes(
		workspaceId,
		CHAT_MIN_SIZE,
		showChat,
	);

	useEffect(() => {
		document.documentElement.style.setProperty("--radius", `${radius}rem`);
	}, [radius]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <only runs on theme change>
	useLayoutEffect(() => {
		applyTheme();
	}, [theme]);

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
			className={`flex h-screen overflow-auto bg-background/85 ${side < SIDES.TOP ? "flex-row" : "flex-col"}`}
			translate="no"
		>
			<EditorActions
				direction={direction}
				className={className}
				tooltipSide={tooltipSide}
			/>

			<ResizablePanelGroup
				id={workspaceId}
				direction="horizontal"
				className={showChat ? "min-w-[720px]" : "min-w-0"}
			>
				{showChat && (
					<>
						<ResizablePanel
							id={`${workspaceId}-chat`}
							order={1}
							defaultSize={40}
							minSize={chatMinSize}
						>
							<Chat />
						</ResizablePanel>
						<ResizableHandle
							id={`resize-handle-${workspaceId}`}
							aria-label="Resize chat panel"
							className="w-2"
						/>
					</>
				)}

				<ResizablePanel
					id={`${workspaceId}-editor`}
					order={2}
					defaultSize={60}
					minSize={showChat ? 20 : 0}
				>
					<EditorTabs />
					{tab ? (
						<EditorLayout tab={tab} lang={langFromName(tab.name)} />
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
