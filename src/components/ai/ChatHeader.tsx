import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";

interface ChatHeaderProps {
	onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
	return (
		<header className="flex items-center justify-between gap-2 px-4  py-2">
			<div className="flex gap-x-2 items-center">
				<MessageCircle />
				<p>Chat</p>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={onNewChat}
				className="flex items-center gap-2"
			>
				<Plus />
			</Button>
		</header>
	);
}
