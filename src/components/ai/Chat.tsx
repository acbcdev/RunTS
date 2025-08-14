import { useChat } from "@/hooks/useChat";

import { AI } from "@/components/settings/tabs/ai";
import { useAIConfigStore } from "@/store/aiConfig";
import { useShallow } from "zustand/react/shallow";
import { ChatActions } from "./ChatActions";
import { EmptyChatView } from "./EmptyChatView";
import { Messages } from "./core/Messages";
import { PromptInputWithActions } from "./core/PrompInput";
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
		setMessages,
		isLoading,
		streamingContent,
		handleSubmit,
		stop,
		reload,
		error,
	} = useChat();

	const handleNewChat = () => {
		setMessages([]);
		setInput("");
	};
	if (getProviders().length === 0) {
		return <AI tabs={false} />;
	}

	const isEmpty = !messages || messages.length === 0;

	return (
		<aside
			data-state={showChat}
			className="relative flex bg-border/10 max-w-3xl flex-col w-full h-full mx-auto chat rounded-none shadow-none "
		>
			<ChatActions onNewChat={handleNewChat} />
			{isEmpty ? (
				<EmptyChatView />
			) : (
				<Messages
					messages={messages}
					streamingContent={streamingContent}
					isLoading={isLoading}
					reload={reload}
					error={error}
				/>
			)}
			<section className="flex flex-col gap-2 p-4">
				<PromptInputWithActions
					value={input}
					onValueChange={setInput}
					isLoading={isLoading}
					onSubmit={handleSubmit}
					stop={stop}
				/>
			</section>
		</aside>
	);
}
Chat.displayName = "Chat";
export default Chat;
