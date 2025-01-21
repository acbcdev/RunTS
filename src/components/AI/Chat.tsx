import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import MultiModalInput from "./core/MultiModal-Input";

import { useAIConfigStore } from "@/store/aiConfig";
import { AI } from "../settings/tabs/ai";
export function Chat() {
	const { getProviders } = useAIConfigStore();
	const {
		input,
		messages,
		setInput,
		isLoading,
		streamingContent,
		handleSubmit,
	} = useChat();

	return getProviders().length === 0 ? (
		<AI tabs={false} />
	) : (
		<aside className="relative flex flex-col w-full h-full max-w-2xl border-none rounded-none shadow-none bg-background">
			<ScrollArea className="flex-1 h-0">
				<section className="p-4 space-y-4 overflow-y-auto">
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
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									className="prose break-all hyphens-auto dark:prose-invert "
								>
									{message.content}
								</ReactMarkdown>
							</div>
						</div>
					))}
					{streamingContent && (
						<div className="flex mb-4 gap-x-2">
							<ReactMarkdown className="prose break-all hyphens-auto dark:prose-invert ">
								{streamingContent}
							</ReactMarkdown>
							<div className="rounded-full size-5 bg-border " />
						</div>
					)}
				</section>
			</ScrollArea>

			<section className="left-0 right-0 flex flex-col gap-2 p-4 bg-background">
				<MultiModalInput
					input={input}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					setInput={setInput}
				/>
			</section>
		</aside>
	);
}
