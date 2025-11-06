import { MessageCircleDashed } from "lucide-react";
import { EmptyStateView } from "@/features/common/components/EmptyStateView";

export function EmptyChatView() {
	return (
		<EmptyStateView
			icon={<MessageCircleDashed size={64} strokeWidth={1.5} />}
			title="There are no messages yet"
			description="Start a conversation by typing below!"
			className="text-muted-foreground"
		/>
	);
}
