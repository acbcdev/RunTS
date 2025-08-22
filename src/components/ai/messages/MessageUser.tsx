import Markdown from "@/components/ai/messages/Markdown";
import type { UIMessage } from "ai";

type MessageUserProps = {
	message: UIMessage;
};

function MessageUser({ message }: MessageUserProps) {
	return (
		<div className="flex justify-end">
			<div className="rounded-lg px-4 py-1 bg-background/90 text-primary-foreground">
				{message.parts.map((part) => {
					if (part.type === "text") {
						return (
							<Markdown key={`${message.id}-${part.text.slice(0, 20)}`}>
								{part.text}
							</Markdown>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}

export default MessageUser;
