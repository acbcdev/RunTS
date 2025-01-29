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
import { toast } from "sonner";
import { memo } from "react";
import { Kd } from "@/components/ui/kd";
import { useShallow } from "zustand/react/shallow";
import { useApparenceStore } from "@/store/apparence";
import { useTabsStore } from "@/store/tabs";
import { useRun } from "@/hooks/useRun";

export const EditorTopBar = memo(function EditorTopBar() {
	const { layout, setLayout } = useApparenceStore(
		useShallow((state) => ({
			layout: state.layout,
			setLayout: state.setLayout,
		})),
	);
	const { runCode } = useRun();
	const clearConsole = useTabsStore(useShallow((state) => state.clearConsole));
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const { toggleChat, showChat } = useAIConfigStore(
		useShallow((state) => ({
			toggleChat: state.toggleChat,
			showChat: state.showChat,
		})),
	);

	const handleShare = () => {
		const url = new URL(window.location.href);
		if (activeTab?.code === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to share.",
				duration: 2000,
			});
			return;
		}
		const link = `${url.origin}/?code=${btoa(activeTab?.code ?? "")}`;
		navigator.clipboard.writeText(link);
		toast.success("Link Created", {
			description: `The ${link} has been copied to your clipboard.`,
			duration: 2000,
		});
	};
	const toogleLayout = () => {
		setLayout(layout === "horizontal" ? "vertical" : "horizontal");
	};
	const handleClear = () => {
		clearConsole();
		toast.success("Console cleared", {
			description: "The console output has been cleared.",
			duration: 2000,
		});
	};

	const copyCode = () => {
		if (activeTab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to copy.",
				duration: 2000,
			});
			return;
		}
		navigator.clipboard.writeText(activeTab?.code ?? "");
		toast.success("Code copied!", {
			description: "The code has been copied to your clipboard.",
			duration: 2000,
		});
	};

	const downloadCode = () => {
		if (!activeTab || activeTab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to download.",
				duration: 2000,
			});
			return;
		}
		const blob = new Blob([activeTab?.code ?? ""], { type: "text/typescript" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = activeTab?.name || "code.ts";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Code downloaded!", {
			description: "The code has been downloaded as 'code.js'",
			duration: 2000,
		});
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
								onClick={handleShare}
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
								onClick={copyCode}
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
								onClick={downloadCode}
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
