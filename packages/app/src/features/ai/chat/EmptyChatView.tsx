import { MessageCircleDashed } from "lucide-react";
import { Button } from "@/features/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/features/ui/empty";

const COMMANDS = [
	["/explain", "Explain this code"],
	["/fix", "Find the bug in this code"],
	["/types", "Add types to this code"],
] as const;

export function EmptyChatView({ onPick }: { onPick: (text: string) => void }) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<MessageCircleDashed />
				</EmptyMedia>
				<EmptyTitle>How can I help?</EmptyTitle>
				<EmptyDescription>Type below, or try a command.</EmptyDescription>
			</EmptyHeader>
			<div className="flex flex-wrap justify-center gap-2">
				{COMMANDS.map(([label, prompt]) => (
					<Button
						key={label}
						variant="outline"
						size="sm"
						className="font-mono"
						onClick={() => onPick(prompt)}
					>
						{label}
					</Button>
				))}
			</div>
		</Empty>
	);
}
