import { GithubStars } from "@/components/settings/GithubStars";
import { AI } from "@/components/settings/tabs/ai";
import { Appearance } from "@/components/settings/tabs/appearance";
import { Editor } from "@/components/settings/tabs/editor";
import { Button } from "@/components/ui/button";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { versionApp } from "@/consts";
import { BrainCog, Brush, Cog, MonitorCog } from "lucide-react";
const Trigers = [
	{ name: "Appearance", Icon: Brush },
	{ name: "Editor", Icon: MonitorCog },
	{ name: "AI", Icon: BrainCog },
];
export function EditorSettingsDialog() {
	return (
		<Dialog aria-description="Editor settings">
			<Tooltip>
				<DialogTrigger asChild>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Editor settings"
							className="size-8"
							translate="no"
						>
							<Cog />
						</Button>
					</TooltipTrigger>
				</DialogTrigger>
				<TooltipContent>Editor settings</TooltipContent>
			</Tooltip>

			<DialogContent
				aria-describedby="editor-settings-dialog-description"
				aria-description="Editor settings"
				className="p-0 overflow-hidden xl:max-w-7xl lg:max-w-3xl"
			>
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>
						Editor Settings <span className="opacity-85">{versionApp}</span>
					</DialogTitle>
					<DialogDescription>Configure the editor settings</DialogDescription>
					<div className="flex items-center flex-wrap gap-2 mt-2 ">
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
						<a
							href="https://github.com/acbcdev/runts/issues/new"
							target="_blank"
							rel="noreferrer"
							className="bg-input text-lg border  rounded-lg px-3 py-2  font-semibold"
						>
							Feedback
						</a>
						<a
							href="https://github.com/acbcdev/runts/issues/new"
							target="_blank"
							rel="noreferrer"
							className="bg-input border rounded-lg px-3 py-2 text-lg font-semibold"
						>
							Report a bug
						</a>
						<a
							href="https://github.com/acbcdev/RunTS/blob/main/CHANGELOG.md"
							target="_blank"
							rel="noreferrer"
							className="bg-input text-lg border  rounded-lg px-3 py-2  font-semibold"
						>
							Changelog
						</a>
					</div>
				</DialogHeader>

				<Tabs defaultValue="appearance" className="flex-1">
					<TabsList className="h-12 px-6 justify-start">
						{Trigers.map(({ name, Icon }) => (
							<TabsTrigger key={name} value={name.toLowerCase()}>
								<Icon className="size-4 mr-1" /> {name}
							</TabsTrigger>
						))}
					</TabsList>
					<ScrollArea className="max-h-[85dvh] h-[60dvh] ">
						<Appearance />
						<Editor />
						<AI />
					</ScrollArea>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
