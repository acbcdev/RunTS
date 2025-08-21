import { Button } from "@/components/ui/button";
import { Kd } from "@/components/ui/kd";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHandler } from "@/hooks/useHandler";
import { useRun } from "@/hooks/useRun";
import { cn } from "@/lib/utils";
import { useAIConfigStore } from "@/store/aiConfig";
import { useApparenceStore } from "@/store/apparence";
import { useModalStore } from "@/store/modal";
import { isTauri } from "@tauri-apps/api/core";
import {
	Cog,
	Download,
	Play,
	Search,
	Share2,
	Sparkles,
	SquareSplitHorizontal,
	SquareSplitVertical,
} from "lucide-react";
import { type JSX, type ReactNode, memo } from "react";
import { useShallow } from "zustand/react/shallow";

type ActionPosition = "start" | "end";
type ActionDirection = "row" | "column";

type Action = {
	id: string;
	icon: JSX.Element;
	label: string;
	onClick: () => void;
	tooltip: ReactNode;
	position: ActionPosition;
	active?: boolean;
	disabled?: boolean;
	className?: string;
};

interface EditorActionsProps {
	direction?: ActionDirection;
	className?: string;
	tooltipSide?: "left" | "right" | "top" | "bottom";
}

export const EditorActions = memo<EditorActionsProps>(
	({ direction = "row", className = "", tooltipSide }) => {
		const { layout, setOption } = useApparenceStore(
			useShallow((state) => ({
				layout: state.layout,
				setOption: state.setOption,
			})),
		);
		const toggle = useModalStore((state) => state.toggleModal);
		const { runCode } = useRun();
		const { handleShare, downloadCode } = useHandler();
		const { toggleChat, showChat } = useAIConfigStore(
			useShallow((state) => ({
				toggleChat: state.toggleChat,
				showChat: state.showChat,
			})),
		);

		const toggleLayout = () => {
			setOption("layout", layout === "horizontal" ? "vertical" : "horizontal");
		};

		const actions: Action[] = [
			{
				id: "settings",
				icon: <Cog />,
				label: "Editor settings",
				onClick: () => toggle("settings"),
				tooltip: (
					<>
						Settings <Kd>Ctrl + ,</Kd>
					</>
				),
				position: "start",
				active: true,
			},

			{
				id: "run",
				icon: <Play />,
				label: "Run code",
				className: "text-accent",
				onClick: runCode,
				tooltip: (
					<>
						Run code <Kd>Ctrl + R</Kd>
					</>
				),
				position: "start",
				active: true,
			},
			{
				id: "layout",
				icon:
					layout === "horizontal" ? (
						<SquareSplitHorizontal />
					) : (
						<SquareSplitVertical />
					),
				label: "Toggle layout",
				tooltip: "Toggle layout",
				onClick: toggleLayout,
				position: "start",
				active: true,
			},
			{
				id: "chat",
				icon: <Sparkles />,
				label: "Show Chat",
				onClick: toggleChat,
				tooltip: (
					<>
						Show Chat <Kd>Ctrl + B</Kd>
					</>
				),
				position: "start",
				active: true,
				className: showChat
					? "bg-linear-to-br from-accent from-30% to-destructive hover:text-foreground"
					: "",
			},
			{
				id: "search",
				icon: <Search />,
				label: "Search",
				onClick: () => toggle("commandK"),
				tooltip: (
					<>
						Search <Kd>Ctrl + K</Kd>
					</>
				),
				position: "start",
				active: true,
			},
			{
				id: "share",
				icon: <Share2 />,
				label: "Share code",
				onClick: handleShare,
				tooltip: "Share code current tab",
				position: "end",
				active: !isTauri(),
				className: "text-accent",
			},
			{
				id: "download",
				icon: <Download />,
				label: "Download code",
				onClick: downloadCode,
				tooltip: "Download code",
				position: "end",
				active: true,
			},
		];

		const activeActions = actions.filter((action) => action.active);
		const startActions = activeActions.filter(
			(action) => action.position === "start",
		);
		const endActions = activeActions.filter(
			(action) => action.position === "end",
		);

		const renderActionButton = (action: Action) => (
			<Tooltip key={action.id}>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label={action.label}
						className={`size-8 ${action.className || ""}`}
						onClick={() => action.onClick()}
						disabled={action.disabled}
					>
						{action.icon}
					</Button>
				</TooltipTrigger>
				<TooltipContent side={tooltipSide}>{action.tooltip}</TooltipContent>
			</Tooltip>
		);

		const containerClasses =
			direction === "row"
				? "flex items-center justify-between"
				: "flex flex-col items-center justify-between";

		const groupClasses =
			direction === "row"
				? "flex items-center gap-x-2"
				: "flex flex-col items-center gap-y-2";

		return (
			<TooltipProvider delayDuration={500} skipDelayDuration={100}>
				<div className={cn(`${containerClasses} p-2  bg-header `, className)}>
					<div className={groupClasses}>
						{startActions.map(renderActionButton)}
					</div>
					<div className={groupClasses}>
						{endActions.map(renderActionButton)}
					</div>
				</div>
			</TooltipProvider>
		);
	},
);

EditorActions.displayName = "EditorActions";
export default EditorActions;
