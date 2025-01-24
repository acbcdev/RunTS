import {
	Play,
	Download,
	Copy,
	Trash2,
	Columns,
	Rows,
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
import { useEditorStore } from "@/store/editor";
import { EditorSettingsDialog } from "@/components/settings/editor-setting-dialog";
import { useConfigStore } from "@/store/config";
import { useAIConfigStore } from "@/store/aiConfig";
import { toast } from "sonner";
import { memo } from "react";
import { Kd } from "../ui/kd";
import { useShallow } from "zustand/react/shallow";

export const EditorTopBar = memo(function EditorTopBar() {
	const { code, activeTabId, currentTab, clearConsole, runCode } =
		useEditorStore(
			useShallow((state) => ({
				code: state.code,
				activeTabId: state.activeTabId,
				currentTab: state.currentTab,
				clearConsole: state.clearConsole,
				runCode: state.runCode,
			})),
		);
	const { layout, setLayout } = useConfigStore(
		useShallow((state) => ({
			layout: state.layout,
			setLayout: state.setLayout,
		})),
	);
	const { toggleChat } = useAIConfigStore(
		useShallow((state) => ({
			toggleChat: state.toggleChat,
		})),
	);
	const handleShare = () => {
		const url = new URL(window.location.href);
		if (code === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to share.",
				duration: 2000,
			});
			return;
		}
		const link = `${url.origin}/?code=${btoa(code)}`;
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
		clearConsole(activeTabId);
		toast.success("Console cleared", {
			description: "The console output has been cleared.",
			duration: 2000,
		});
	};

	const copyCode = () => {
		if (code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to copy.",
				duration: 2000,
			});
			return;
		}
		navigator.clipboard.writeText(code);
		toast.success("Code copied!", {
			description: "The code has been copied to your clipboard.",
			duration: 2000,
		});
	};

	const downloadCode = () => {
		const activeCode = currentTab(activeTabId);
		if (!activeCode || activeCode.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to download.",
				duration: 2000,
			});
			return;
		}
		const blob = new Blob([code], { type: "text/typescript" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = activeCode?.name || "code.ts";
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
				className={
					"flex items-center justify-between p-2 border-b bg-header border-border "
				}
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
								{layout === "horizontal" ? <Columns /> : <Rows />}
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
								className="size-8  from-accent hover:bg-linear-to-br hover:text-foreground from-30% to-destructive "
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
