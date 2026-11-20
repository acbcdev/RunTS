import {
	BrainCog,
	Brush,
	ExternalLink,
	FileCode2,
	MonitorCog,
	RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { useModalStore } from "@/features/common/modal/modal";
import { versionApp } from "@/features/common/utils/const";
import { useEditorStore } from "@/features/editor/editor-store/editor";
import { Button } from "@/features/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/features/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/features/ui/tabs";
import { useApparenceStore } from "../appearance-store/appearance";
import { useConfigStore } from "../config-store/config";
import { AI, Appearance, Editor, Formatting } from "../sections";

const sections = [
	{
		value: "appearance",
		name: "Appearance",
		description: "Colors, typography, and layout.",
		Icon: Brush,
	},
	{
		value: "editor",
		name: "Editor",
		description: "Make your editor behave the way you think.",
		Icon: MonitorCog,
	},
	{
		value: "formatting",
		name: "Formatting",
		description: "A consistent rhythm for your code.",
		Icon: FileCode2,
	},
	{
		value: "ai",
		name: "AI",
		description: "Your providers. Your instructions.",
		Icon: BrainCog,
	},
];
const links = [
	{ name: "Support", url: "https://www.buymeacoffee.com/runts" },
	{ name: "GitHub", url: "https://github.com/acbcdev/RunTS" },
	{ name: "Feedback", url: "https://github.com/acbcdev/runts/issues/new" },
	{
		name: "Changelog",
		url: "https://github.com/acbcdev/RunTS/blob/main/packages/app/CHANGELOG.md",
	},
];

function resetPreferences() {
	const { theme, fontSize, fontFamily, radius, layout, side } =
		useApparenceStore.getInitialState();
	useApparenceStore
		.getState()
		.updateApparence({ theme, fontSize, fontFamily, radius, layout, side });
	useConfigStore.getState().resetConfig();
	const { expression, alignLogs } = useEditorStore.getInitialState();
	useEditorStore.getState().updateEditor({ expression, alignLogs });
}

export function EditorSettingsDialog() {
	const open = useModalStore((state) => state.settings);
	const setModalValue = useModalStore((state) => state.setModalValue);
	const [active, setActive] = useState("appearance");
	const section = sections.find((item) => item.value === active) ?? sections[0];
	return (
		<Dialog
			open={open}
			onOpenChange={(value) => setModalValue("settings", value)}
		>
			<DialogContent className="flex h-[min(730px,calc(100dvh-32px))] max-w-[calc(100vw-24px)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[1030px]">
				<DialogHeader className="shrink-0 border-b px-6 py-5 text-left">
					<DialogTitle>
						Settings{" "}
						<span className="ml-2 text-[10px] font-normal text-foreground/65">
							{versionApp}
						</span>
					</DialogTitle>
					<DialogDescription>Make RunTS work the way you do.</DialogDescription>
				</DialogHeader>
				<Tabs
					orientation="vertical"
					value={active}
					onValueChange={setActive}
					className="min-h-0 flex-1 flex-row gap-0"
				>
					<div className="flex w-14 shrink-0 flex-col gap-4 border-r bg-header px-2 py-5 sm:w-[182px] sm:px-3">
						<TabsList
							aria-label="Settings sections"
							className="h-auto flex-col items-stretch justify-start gap-1 p-0"
						>
							{sections.map(({ value, name, Icon }) => (
								<TabsTrigger
									key={value}
									value={value}
									aria-label={name}
									title={name}
									className="m-0 justify-center gap-2.5 border-0 px-2 py-3 text-xs shadow-none data-[state=active]:bg-background data-[state=active]:shadow-none sm:justify-start sm:px-3 [&[data-state=active]>svg]:text-accent"
								>
									<Icon className="size-4 shrink-0" />
									<span className="hidden sm:inline">{name}</span>
								</TabsTrigger>
							))}
						</TabsList>
						<nav
							aria-label="RunTS links"
							className="mt-auto flex flex-col gap-1"
						>
							{links.map(({ name, url }) => (
								<a
									key={name}
									href={url}
									target="_blank"
									rel="noreferrer"
									aria-label={name}
									title={name}
									className="flex items-center justify-center gap-2 rounded-md px-2 py-2 text-[10px] text-foreground/65 hover:bg-background hover:text-foreground sm:justify-start sm:px-3"
								>
									<ExternalLink
										aria-hidden="true"
										className="size-3 shrink-0"
									/>
									<span className="hidden sm:inline">{name}</span>
								</a>
							))}
						</nav>
						<Button
							variant="ghost"
							size="sm"
							onClick={resetPreferences}
							aria-label="Reset preferences"
							title="Reset preferences"
							className="justify-center px-2 sm:justify-start sm:px-3"
						>
							<RotateCcw aria-hidden="true" data-icon="inline-start" />
							<span className="hidden sm:inline">Reset preferences</span>
						</Button>
					</div>
					<div
						key={active}
						className="min-w-0 flex-1 overflow-y-auto px-4 py-7 sm:px-8"
					>
						<header className="mb-7 flex flex-col gap-1">
							<p className="mb-1 font-mono text-[8px] tracking-[1.6px] text-foreground/65">
								WORKSPACE PREFERENCES
							</p>
							<h2 className="text-[25px] font-medium tracking-tight">
								{section.name}
							</h2>
							<p className="text-xs text-foreground/65">
								{section.description}
							</p>
						</header>
						<Appearance />
						<Editor />
						<Formatting />
						<AI />
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
