import { Plus } from "lucide-react";
import { Button } from "@/features/ui/button";
import { MessageCircleIcon } from "@/features/ui/message-circle";
import type { ChatHeaderProps } from "./types";

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
	return (
		<header className="flex items-center justify-between px-4 py-2">
			<div className="flex items-center gap-x-2">
				<MessageCircleIcon size={20} />
				<p>Chat</p>
			</div>
			<Button variant="ghost" size="icon" onClick={onNewChat}>
				<Plus />
			</Button>
		</header>
	);
}
