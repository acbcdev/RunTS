import { Command, MessageCircleIcon, Plus } from "lucide-react";
import { getModifierKey } from "@/features/common/utils/shortcuts";
import { Kbd, KbdGroup } from "@/features/ui/kbd";

const commands = [
	{
		icon: <Plus className="size-5" />,
		title: "Create New Tab",
		description: "Start coding with JavaScript or TypeScript",
		shortcut: [getModifierKey(), "Alt", "T"],
	},

	{
		icon: <Command className="size-5" />,
		title: "Show All Commands",
		description: "Open command palette",
		shortcut: [getModifierKey(), "K"],
	},
	{
		icon: <MessageCircleIcon className="size-5" />,
		title: "Open Chat",
		description: "Open chat with AI",
		shortcut: [getModifierKey(), "B"],
	},
];

export const EmptyState = () => (
	<section className="flex items-center justify-center h-full bg-background">
		<div className="w-full max-w-2xl mx-4">
			<header className="text-center mb-8">
				<picture className="mx-auto mb-6  flex items-center justify-center">
					<img src="/logo.png" alt="RunTS Logo" className="size-24" />
				</picture>
				<h1 className="text-2xl font-semibold mb-2 text-foreground/80">
					Runts
				</h1>
				<p className="text-muted-foreground text-sm">
					Start coding instantly. Your ideas deserve immediate execution. 🚀
				</p>
			</header>

			<ul className="  rounded-lg p-2 space-y-1">
				{commands.map((command) => (
					<li
						key={command.title}
						className="w-full flex items-center gap-2 px-3 py-3 "
					>
						<div className="text-muted-foreground mr-1.5 border p-2 bg-border rounded-xl">
							{command.icon}
						</div>
						<div className="flex-1 min-w-0">
							<div className="font-medium text-sm">{command.title}</div>
							<div className="text-xs text-muted-foreground truncate">
								{command.description}
							</div>
						</div>
						<KbdGroup>
							{command.shortcut.map((key, index) => (
								<>
									<Kbd key={key}>{key}</Kbd>
									{index < command.shortcut.length - 1 && "+"}
								</>
							))}
						</KbdGroup>
					</li>
				))}
			</ul>
		</div>
	</section>
);
export default EmptyState;
