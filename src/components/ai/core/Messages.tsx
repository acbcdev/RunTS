import ActionButtons from "@/components/ai/core/ActionButtons";
import Markdown from "@/components/ai/core/Markdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UIMessage } from "ai";
import { RefreshCw } from "lucide-react";
import { memo, useEffect, useLayoutEffect, useRef } from "react";

type PureMessagesProps = {
	messages: UIMessage[];
	isLoading: boolean;
	streamingContent: string;
	reload: () => void;
	error: string;
};

function PureMessages({
	messages,
	isLoading,
	streamingContent,
	error,
	reload,
}: PureMessagesProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollIntoView({
				behavior: "instant",
				block: "end",
			});
		}
	}, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [messages, isLoading]);
	return (
		<ScrollArea className="flex-1 h-0 scroll-m-2 ">
			<section ref={containerRef} className="px-4 py-2 space-y-4 overflow-auto">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex  ${
							message.role === "user" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`rounded-lg px-4 py-1  ${
								message.role === "user"
									? "bg-background/90 text-primary-foreground"
									: ""
							}`}
						>
							{message.role === "user" &&
								message.parts.map((part) => {
									if (part.type === "text")
										return (
											<>
												<Markdown>{part.text}</Markdown>
											</>
										);
								})}
							{message.role === "assistant" &&
								message.parts.map((part) => {
									if (part.type === "text")
										return (
											<>
												<Markdown>{part.text}</Markdown>
												<ActionButtons content={part.text} reload={reload} />
											</>
										);
								})}
						</div>
					</div>
				))}
				{error && (
					<div className="border border-destructive  px-4 py-5 rounded-lg">
						<Markdown>{error}</Markdown>
						<Button onClick={reload}>
							Reload
							<RefreshCw />
						</Button>
					</div>
				)}
				<div
					className={`bg-accent/10 px-4 py-2 rounded-lg ${
						!streamingContent && "hidden"
					}`}
				>
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
