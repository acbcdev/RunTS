import { MessageCircle } from "lucide-react";

export function EmptyChatView() {
	return (
		<div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
			<MessageCircle size={64} strokeWidth={1.5} />
			<p className="text-lg font-medium">There are no messages yet</p>
			<p className="text-sm text-center max-w-md">
				Start a conversation by typing below!
			</p>
		</div>
	);
}
