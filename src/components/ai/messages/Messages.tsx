import type { UIMessage } from "ai";
import { RefreshCw } from "lucide-react";
import { memo, useRef } from "react";
import Markdown from "@/components/ai/messages/Markdown";
import MessageAssistant from "@/components/ai/messages/MessageAssistant";
import MessageUser from "@/components/ai/messages/MessageUser";
import { Button } from "@/components/ui/button";
import {
	ChatContainerContent,
	ChatContainerRoot,
	ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";

type PureMessagesProps = {
	messages: UIMessage[];
	isLoading: boolean;
	reload: () => void;
	error: string;
};

function PureMessages({ messages, error, reload }: PureMessagesProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={containerRef}
			className="scroll-chat relative flex-1 overflow-hidden"
		>
			<ChatContainerRoot className="h-full flex-1">
				<ChatContainerContent className="px-2 py-4 space-y-4 ">
					{messages.map((message) => (
						<div key={message.id}>
							{message.role === "user" ? (
								<MessageUser message={message} />
							) : (
								<MessageAssistant message={message} reload={reload} />
							)}
						</div>
					))}

					{error && (
						<div className="border border-destructive px-4 py-5 rounded-lg">
							<Markdown>{error}</Markdown>
							<Button onClick={reload} className="mt-2">
								Reload
								<RefreshCw className="ml-2 h-4 w-4" />
							</Button>
						</div>
					)}

					<ChatContainerScrollAnchor />
				</ChatContainerContent>
				{/* Scroll to bottom button */}
				<div className="absolute bottom-2  right-4 z-50">
					<ScrollButton />
				</div>
			</ChatContainerRoot>
		</div>
	);
}

export const Messages = memo(PureMessages);
