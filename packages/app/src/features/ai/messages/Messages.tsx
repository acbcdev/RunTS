import type { UIMessage } from "ai";
import { AlertCircle, RefreshCw } from "lucide-react";
import { memo, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/features/ui/alert";
import { Button } from "@/features/ui/button";
import {
	ChatContainerContent,
	ChatContainerRoot,
	ChatContainerScrollAnchor,
} from "@/features/ui/chat-container";
import { Marker, MarkerContent } from "@/features/ui/marker";
import { ScrollButton } from "@/features/ui/scroll-button";
import Markdown from "./Markdown";
import MessageAssistant from "./MessageAssistant";
import MessageUser from "./MessageUser";

type PureMessagesProps = {
	messages: UIMessage[];
	isLoading: boolean;
	reload: () => void;
	error: string;
};

function PureMessages({
	messages,
	isLoading,
	error,
	reload,
}: PureMessagesProps) {
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

					{isLoading && messages.at(-1)?.role === "user" && (
						<Marker role="status">
							<MarkerContent className="animate-pulse">
								Thinking...
							</MarkerContent>
						</Marker>
					)}

					{error && (
						<Alert variant="destructive">
							<AlertCircle />
							<AlertTitle>Something went wrong</AlertTitle>
							<AlertDescription>
								<Markdown>{error}</Markdown>
								<Button
									onClick={reload}
									variant="outline"
									size="sm"
									className="mt-2"
								>
									Reload
									<RefreshCw />
								</Button>
							</AlertDescription>
						</Alert>
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
