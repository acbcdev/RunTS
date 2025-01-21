import {
	Play,
	Download,
	Copy,
	Trash2,
	Columns,
	Rows,
	Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useEditorStore } from "@/store/editor";
import { EditorSettingsDialog } from "@/components/settings/editor-setting-dialog";
import { useConfigStore } from "@/store/config";
import { memo } from "react";

export const EditorTopBar = memo(function EditorTopBar() {
	const { toast } = useToast();
	const { code, clearConsole, runCode, activeTabId } = useEditorStore();
	const { layout, setLayout } = useConfigStore();

	const handleShare = () => {
		const url = new URL(window.location.href);
		if (code === "") {
			toast({
				variant: "destructive",
				title: "Empty Code",
				description: "The code is empty, nothing to share.",
				duration: 2000,
			});
			return;
		}
		const link = `${url.origin}/?code=${btoa(code)}`;
		navigator.clipboard.writeText(link);
		toast({
			title: "Link Created",
			description: `The ${link} has been copied to your clipboard.`,
			duration: 2000,
		});
	};
	const toogleLayout = () => {
		setLayout(layout === "horizontal" ? "vertical" : "horizontal");
	};
	const handleClear = () => {
		clearConsole(activeTabId);
		toast({
			title: "Console cleared",
			description: "The console output has been cleared.",
			duration: 2000,
		});
	};

	const copyCode = () => {
		navigator.clipboard.writeText(code);
		toast({
			title: "Code copied!",
			description: "The code has been copied to your clipboard.",
			duration: 2000,
		});
	};

	const downloadCode = () => {
		const blob = new Blob([code], { type: "text/typescript" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "code.ts";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast({
			title: "Code downloaded!",
			description: "The code has been downloaded as 'code.js'",
			duration: 2000,
		});
	};

	return (
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
							className="w-8 h-8 text-accent"
							onClick={runCode}
						>
							<Play className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Run code (Ctrl + Q)</TooltipContent>
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
								<Columns className="size-4" />
							) : (
								<Rows className="size-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Toogle layout</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center space-x-2">
				<Tooltip>
					<TooltipTrigger>
						<Button
							aria-label="Share code"
							variant="ghost"
							size="icon"
							className="w-8 h-8 text-accent"
							onClick={handleShare}
						>
							<Share2 className="w-4 h-4" />
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
							className="w-8 h-8"
							onClick={copyCode}
						>
							<Copy className="w-4 h-4" />
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
							className="w-8 h-8"
							onClick={downloadCode}
						>
							<Download className="w-4 h-4" />
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
							className="w-8 h-8"
							onClick={handleClear}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Clear console</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
});
