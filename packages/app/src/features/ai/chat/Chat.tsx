import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Messages } from "../messages";
import { Prompt } from "../prompt";
import { useAIConfigStore } from "../store";
import { useChat } from "../use-chat";
import { ChatHeader } from "./ChatHeader";
import { EmptyChatView } from "./EmptyChatView";
import { NoProvidersView } from "./NoProvidersView";
export function Chat() {
	const { hasProviders, showChat, contextFile, providerName } =
		useAIConfigStore(
			useShallow((state) => ({
				hasProviders: state.getProviders().length > 0,
				showChat: state.showChat,
				contextFile: state.contextFile,
				providerName: state.selectedModel.provider,
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
		send,
		error,
	} = useChat();
	useEffect(() => {
		if (!isLoading) return;
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && stop();
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isLoading, stop]);
	const handleNewChat = () => {
		setMessages([]);
		setInput("");
	};

	if (!hasProviders) {
		return <NoProvidersView />;
	}

	const isEmpty = !messages || messages.length === 0;

	return (
		<aside
			data-state={showChat}
			className={
				"relative flex bg-border/10 flex-col h-full w-full min-w-0 chat rounded-none shadow-none"
			}
		>
			<ChatHeader onNewChat={handleNewChat} />
			{isEmpty ? (
				<EmptyChatView onPick={send} />
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
				<p className="flex justify-between font-mono text-[10px] text-muted-foreground">
					<span>
						{providerName ?? "no model"} · ctx {contextFile ? "on" : "off"}
					</span>
					<span>{isLoading ? "esc stop" : "↵ send"}</span>
				</p>
			</section>
		</aside>
	);
}
Chat.displayName = "Chat";
export default Chat;
