import { BrainCog, Brush, MonitorCog } from "lucide-react";
import { useModalStore } from "@/features/common/modal/modal";
import { versionApp } from "@/features/common/utils/const";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/features/ui/dialog";
import { ScrollArea } from "@/features/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/features/ui/tabs";
import { GithubStars } from "../github-stars/GithubStars";
import { AI } from "../sections/ai";
import { Appearance } from "../sections/appearance";
import { Editor } from "../sections/editor";

const Trigers = [
	{ name: "Appearance", Icon: Brush },
	{ name: "Editor", Icon: MonitorCog },
	{ name: "AI", Icon: BrainCog },
];
export function EditorSettingsDialog() {
	const open = useModalStore((state) => state.settings);
	const toggle = useModalStore((state) => state.toggleModal);
	return (
		<Dialog
			open={open}
			onOpenChange={() => toggle("settings")}
			aria-description="Editor settings"
		>
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
								<Icon className="size-4 mr-2" /> {name}
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
