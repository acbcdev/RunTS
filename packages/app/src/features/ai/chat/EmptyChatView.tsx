import { MessageCircleDashed } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/features/ui/empty";

export function EmptyChatView() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<MessageCircleDashed />
				</EmptyMedia>
				<EmptyTitle>There are no messages yet</EmptyTitle>
				<EmptyDescription>
					Start a conversation by typing below!
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
