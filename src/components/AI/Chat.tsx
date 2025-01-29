import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import MultiModalInput from "./core/MultiModal-Input";

import { useAIConfigStore } from "@/store/aiConfig";
import { AI } from "@/components/Settings/tabs/ai";
import Markdown from "@/components/AI/core/Markdown";
import { useShallow } from "zustand/react/shallow";
export function Chat() {
	const { getProviders, showChat } = useAIConfigStore(
		useShallow((state) => ({
			getProviders: state.getProviders,
			showChat: state.showChat,
		})),
	);

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
		<aside
			data-state={showChat}
			className="relative flex flex-col w-full h-full max-w-3xl mx-auto border-none rounded-none shadow-none chat bg-background"
		>
			<ScrollArea className="flex-1 h-0 scroll-m-2 ">
				<section className="p-4 space-y-4 overflow-auto">
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
					{streamingContent && (
						<div className="flex flex-col mb-4 prose break-all animate-pulse gap-x-2 hyphens-auto ">
							<Markdown
							// className="prose break-all hyphens-auto dark:prose-invert "
							>
								{streamingContent}
							</Markdown>
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
