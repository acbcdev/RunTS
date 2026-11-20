import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/features/ui/button";
import type { ChatHeaderProps } from "./types";

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
	return (
		<header className="flex items-center justify-between px-4 py-2">
			<div className="flex items-center gap-x-2">
				<MessageCircle className="size-5" />
				<p>Chat</p>
			</div>
			<Button
				variant="ghost"
				size="icon"
				aria-label="New chat"
				className="transition-[color,background-color,border-color,box-shadow,scale] duration-160 ease-out active:scale-[0.97] motion-reduce:active:scale-100"
				onClick={onNewChat}
			>
				<Plus />
			</Button>
		</header>
	);
}
