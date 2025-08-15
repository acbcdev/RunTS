import { useChat } from "@/hooks/useChat";

import { useAIConfigStore } from "@/store/aiConfig";
import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { ChatHeader } from "./ChatHeader";
import { EmptyChatView } from "./EmptyChatView";
import { NoProvidersView } from "./NoProvidersView";
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
		return <NoProvidersView />;
	}

	const isEmpty = !messages || messages.length === 0;

	return (
		<aside
			data-state={showChat}
			className="relative flex bg-border/10 border-r max-w-3xl flex-col w-full h-full mx-auto chat rounded-none shadow-none"
		>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<ChatHeader onNewChat={handleNewChat} />
			</motion.div>

			<AnimatePresence mode="wait">
				{isEmpty ? (
					<motion.div
						key="empty-view"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="flex-1"
					>
						<EmptyChatView />
					</motion.div>
				) : (
					<Messages
						messages={messages}
						streamingContent={streamingContent}
						isLoading={isLoading}
						reload={reload}
						error={error}
					/>
				)}
			</AnimatePresence>

			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
				className="flex flex-col gap-2 p-4"
			>
				<PromptInputWithActions
					value={input}
					onValueChange={setInput}
					isLoading={isLoading}
					onSubmit={handleSubmit}
					stop={stop}
				/>
			</motion.section>
		</aside>
	);
}
Chat.displayName = "Chat";
export default Chat;
