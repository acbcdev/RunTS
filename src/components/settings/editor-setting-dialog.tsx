import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Appearance } from "@/components/settings/tabs/appearance";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "./tabs/editor";
import { GithubStars } from "@/components/GithubStars";
import { AI } from "./tabs/ai";
const Trigers = ["Appearance", "Editor", "AI (Beta)"];
export function EditorSettingsDialog() {
	return (
		<Dialog aria-description="Editor settings">
			<Tooltip>
				<TooltipTrigger>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Editor settings"
							className="w-8 h-8"
							translate="no"
						>
							<Settings2 className="w-4 h-4" />
						</Button>
					</DialogTrigger>
					<TooltipContent>Editor settings</TooltipContent>
				</TooltipTrigger>
			</Tooltip>

			<DialogContent
				aria-describedby="editor-settings-dialog-description"
				aria-description="Editor settings"
				className="p-0 overflow-hidden xl:max-w-5xl lg:max-w-3xl"
			>
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>
						Editor Settings <span className="opacity-85">v1.2.0</span>
					</DialogTitle>
					<div className="flex items-center gap-2 mt-2 ">
						<a
							href="https://www.buymeacoffee.com/runts"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
								alt="Buy Me A Coffee"
								className="h-10 my-2 aspect-[3.56]"
							/>
						</a>
						<GithubStars />
					</div>
				</DialogHeader>

				<Tabs defaultValue="appearance" className="flex-1">
					<TabsList className="h-12 px-6 ">
						{Trigers.map((tr) => (
							<TabsTrigger key={tr} value={tr.toLowerCase()}>
								{tr}
							</TabsTrigger>
						))}
					</TabsList>
					<ScrollArea className="max-h-[85vh] h-[60vh] ">
						<Appearance />
						<Editor />
						<AI />
					</ScrollArea>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
