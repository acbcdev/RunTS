import type { UIMessage } from "ai";
import { Bubble, BubbleContent } from "@/features/ui/bubble";
import { Message, MessageContent } from "@/features/ui/message";
import Markdown from "./Markdown";

type MessageUserProps = {
	message: UIMessage;
};

export function MessageUser({ message }: MessageUserProps) {
	return (
		<Message align="end">
			<MessageContent>
				<Bubble variant="secondary" align="end">
					<BubbleContent>
						{message.parts.map((part, i) =>
							part.type === "text" ? (
								<Markdown key={`${message.id}-${i}`}>{part.text}</Markdown>
							) : null,
						)}
					</BubbleContent>
				</Bubble>
			</MessageContent>
		</Message>
	);
}

export default MessageUser;
