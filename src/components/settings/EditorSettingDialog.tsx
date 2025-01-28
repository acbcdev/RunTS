import { Cog, Brush, MonitorCog, BrainCog } from "lucide-react";
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
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/components/settings/tabs/editor";
import { GithubStars } from "@/components/settings/GithubStars";
import { AI } from "@/components/settings/tabs/ai";
const Trigers = [
	{ name: "Appearance", Icon: Brush },
	{ name: "Editor", Icon: MonitorCog },
	{ name: "AI (Beta)", Icon: BrainCog },
];
export function EditorSettingsDialog() {
	return (
		<Dialog aria-description="Editor settings">
			<Tooltip>
				<TooltipTrigger>
					<DialogTrigger>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Editor settings"
							className="size-8"
							translate="no"
						>
							<Cog />
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
						Editor Settings <span className="opacity-85">v1.3.0</span>
					</DialogTitle>
					<DialogDescription>Configure the editor settings</DialogDescription>
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
						<a href="https://github.com/acbcdev/runts/issues/new" target="_blank" rel="noreferrer" className="bg-input text-lg border border-border rounded-lg px-4 py-2  font-semibold">
							Feedback
						</a>
						<a href="https://github.com/acbcdev/runts/issues/new" target="_blank" rel="noreferrer" className="bg-input border border-border rounded-lg px-4 py-2 text-lg font-semibold">
							Report a bug
						</a>
					</div>
				</DialogHeader>

				<Tabs defaultValue="appearance" className="flex-1">
					<TabsList className="h-12 px-6 ">
						{Trigers.map(({ name, Icon }) => (
							<TabsTrigger key={name} value={name.toLowerCase()}>
								<Icon className="size-4 mr-1" /> {name}
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
