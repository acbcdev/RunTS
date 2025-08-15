import { useChat } from "@/hooks/useChat";

import { useAIConfigStore } from "@/store/aiConfig";
import { useShallow } from "zustand/react/shallow";
import { ChatHeader } from "./ChatHeader";
import { EmptyChatView } from "./EmptyChatView";
import { NoProvidersView } from "./NoProvidersView";
import { Messages } from "./core/Messages";
import { Prompt } from "./core/PrompInput";
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
		return <NoProvidersView />;
	}

	const isEmpty = !messages || messages.length === 0;

	return (
		<aside
			data-state={showChat}
			className="relative flex bg-border/10 border-r flex-col h-full w-[400px] chat rounded-none shadow-none"
		>
			<ChatHeader onNewChat={handleNewChat} />
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
				<Prompt
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
