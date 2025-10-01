import { useShallow } from "zustand/react/shallow";
import { Messages } from "../messages";
import { Prompt } from "../prompt";
import { useAIConfigStore } from "../store";
import { useChat } from "../use-chat";
import { ChatHeader } from "./ChatHeader";
import { EmptyChatView } from "./EmptyChatView";
import { NoProvidersView } from "./NoProvidersView";
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
			className={
				"relative flex bg-border/10 border-r flex-col h-full w-dvw lg:w-[65ch] chat rounded-none shadow-none"
			}
		>
			<ChatHeader onNewChat={handleNewChat} />
			{isEmpty ? (
				<EmptyChatView />
			) : (
				<Messages
					messages={messages}
					isLoading={isLoading}
					reload={reload}
					error={error}
				/>
			)}
			<section className="flex flex-col gap-2 p-4 sticky bottom-0 left-0 right-0  backdrop-blur-md pt-2">
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
