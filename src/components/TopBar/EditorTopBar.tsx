import { EditorSettingsDialog } from "@/components/Settings/EditorSettingDialog";
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
import { useAIConfigStore } from "@/store/aiConfig";
import { useApparenceStore } from "@/store/apparence";
import {
	Copy,
	Download,
	Play,
	Share2,
	Sparkles,
	SquareSplitHorizontal,
	SquareSplitVertical,
	Trash2,
} from "lucide-react";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

export const EditorTopBar = memo(() => {
	const { layout, setOption } = useApparenceStore(
		useShallow((state) => ({
			layout: state.layout,
			setOption: state.setOption,
		})),
	);
	const { runCode } = useRun();
	const { handleShare, handleClear, copyCode, downloadCode } = useHandler();
	const { toggleChat, showChat } = useAIConfigStore(
		useShallow((state) => ({
			toggleChat: state.toggleChat,
			showChat: state.showChat,
		})),
	);

	const toogleLayout = () => {
		setOption("layout", layout === "horizontal" ? "vertical" : "horizontal");
	};

	return (
		<TooltipProvider delayDuration={500} skipDelayDuration={100}>
			<div
				className={"flex items-center justify-between p-2 border-b bg-header "}
			>
				<div className="flex items-center space-x-2">
					<EditorSettingsDialog />
					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Run code"
								className="size-8 text-accent"
								onClick={runCode}
							>
								<Play />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							Run code <Kd>Ctrl + Q</Kd>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Toogle layout"
								className="size-8"
								onClick={toogleLayout}
							>
								{layout === "horizontal" ? (
									<SquareSplitHorizontal />
								) : (
									<SquareSplitVertical />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Toogle layout</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Run code"
								className={`size-8  from-accent  hover:bg-linear-to-br hover:text-foreground from-30% to-destructive  ${
									showChat && "bg-linear-to-br"
								}`}
								onClick={() => toggleChat()}
							>
								<Sparkles />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							Show Chat <Kd>Ctrl + B</Kd>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex items-center space-x-2">
					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								aria-label="Share code"
								variant="ghost"
								size="icon"
								className="size-8 text-accent"
								onClick={() => handleShare()}
							>
								<Share2 />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Share Code current Tab</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								aria-label="Copy code"
								size="icon"
								className="size-8"
								onClick={() => copyCode()}
							>
								<Copy />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy code</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Download code"
								className="size-8"
								onClick={() => downloadCode}
							>
								<Download />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Download code</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Button
								variant="ghost"
								aria-label="Clear console"
								size="icon"
								className="size-8 hover:text-destructive"
								onClick={handleClear}
							>
								<Trash2 />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Clear console</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
});
EditorTopBar.displayName = "EditorTopBar";
export default EditorTopBar;
