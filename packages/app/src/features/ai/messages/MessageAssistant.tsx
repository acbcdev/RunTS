import type { UIMessage } from "ai";
import { Bubble, BubbleContent } from "@/features/ui/bubble";
import { Message, MessageContent, MessageFooter } from "@/features/ui/message";
import ActionButtons from "./ActionButtons";
import Markdown from "./Markdown";

type MessageAssistantProps = {
	message: UIMessage;
	reload: () => void;
};

export function MessageAssistant({ message, reload }: MessageAssistantProps) {
	return (
		<Message>
			<MessageContent>
				{message.parts.map((part, i) =>
					part.type === "text" ? (
						<div key={`${message.id}-${i}`}>
							<Bubble variant="ghost">
								<BubbleContent>
									<Markdown>{part.text}</Markdown>
								</BubbleContent>
							</Bubble>
							{part.state !== "streaming" && (
								<MessageFooter className="px-0">
									<ActionButtons content={part.text} reload={reload} />
								</MessageFooter>
							)}
						</div>
					) : null,
				)}
			</MessageContent>
		</Message>
	);
}

export default MessageAssistant;
