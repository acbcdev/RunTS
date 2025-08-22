import ActionButtons from "@/components/ai/messages/ActionButtons";
import Markdown from "@/components/ai/messages/Markdown";
import type { UIMessage } from "ai";

type MessageAssistantProps = {
	message: UIMessage;
	reload: () => void;
};

function MessageAssistant({ message, reload }: MessageAssistantProps) {
	return (
		<div className="flex justify-start">
			<div className="rounded-lg px-4 py-1">
				{message.parts.map((part) => {
					if (part.type === "text") {
						return (
							<div key={`${message.id}-${part.text.slice(0, 20)}`}>
								<Markdown>{part.text}</Markdown>
								<ActionButtons content={part.text} reload={reload} />
							</div>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}

export default MessageAssistant;
