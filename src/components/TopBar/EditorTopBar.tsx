import {
	Play,
	Download,
	Copy,
	Trash2,
	SquareSplitHorizontal,
	SquareSplitVertical,
	Share2,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorSettingsDialog } from "@/components/Settings/EditorSettingDialog";
import { useAIConfigStore } from "@/store/aiConfig";
import { memo } from "react";
import { Kd } from "@/components/ui/kd";
import { useShallow } from "zustand/react/shallow";
import { useApparenceStore } from "@/store/apparence";
import { useRun } from "@/hooks/useRun";
import { useHandler } from "@/hooks/useHandler";

export const EditorTopBar = memo(function EditorTopBar() {
	const { layout, setOption } = useApparenceStore(
		useShallow((state) => ({
			layout: state.options.layout,
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
						<TooltipTrigger>
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
							Run code <Kd>(Ctrl + Q)</Kd>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
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
						<TooltipTrigger>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Run code"
								className={`size-8  from-accent  hover:bg-linear-to-br hover:text-foreground from-30% to-destructive  ${showChat && "bg-accent"}`}
								onClick={() => toggleChat()}
							>
								<Sparkles />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							Show Chat <Kd>(ctrl + B)</Kd>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex items-center space-x-2">
					<Tooltip>
						<TooltipTrigger>
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
						<TooltipTrigger>
							<Button
								variant="ghost"
								aria-label="Copy code"
								size="icon"
								className="size-8"
								onClick={() => copyCode}
							>
								<Copy />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy code</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
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
						<TooltipTrigger>
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
