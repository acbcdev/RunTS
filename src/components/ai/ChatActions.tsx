import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatActionsProps {
	onNewChat: () => void;
}

export function ChatActions({ onNewChat }: ChatActionsProps) {
	return (
		<div className="flex items-center justify-between gap-2 px-4  py-1">
			<p>Chat</p>
			<Button
				variant="ghost"
				size="icon"
				onClick={onNewChat}
				className="flex items-center gap-2"
			>
				<Plus />
			</Button>
		</div>
	);
}
