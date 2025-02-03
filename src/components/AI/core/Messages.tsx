import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "ai";
import Markdown from "@/components/AI/core/Markdown";
import { memo, useEffect, useRef } from "react";

function PureMessages({
	messages,
	streamingContent,
}: { messages: Message[]; streamingContent: string }) {
	// const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();
	const containerRef = useRef<HTMLDivElement>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		containerRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
	}, [messages, containerRef]);
	return (
		<ScrollArea className="flex-1 h-0 scroll-m-2 ">
			<section ref={containerRef} className="px-4 py-2 space-y-4 overflow-auto">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${
							message.role === "user" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`rounded-lg p-4  ${
								message.role === "user"
									? "bg-border text-primary-foreground"
									: "bg-input"
							}`}
						>
							<Markdown>{message.content}</Markdown>
						</div>
					</div>
				))}

				<div>
					<Markdown
					// className="prose break-all hyphens-auto dark:prose-invert "
					>
						{streamingContent}
					</Markdown>
					{streamingContent && (
						<div className="rounded-full size-5 bg-border " />
					)}
				</div>
			</section>
		</ScrollArea>
	);
}

// export const Messages = memo(PureMessages, (prevProps, nextProps) => {
// if (prevProps.messages.length === nextProps.messages.length) return false;
// 	return true;
// });

export const Messages = memo(PureMessages);
