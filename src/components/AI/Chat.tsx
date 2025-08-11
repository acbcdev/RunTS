import { useChat } from "@/hooks/useChat";

import { AI } from "@/components/Settings/tabs/ai";
import { useAIConfigStore } from "@/store/aiConfig";
import { useShallow } from "zustand/react/shallow";
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
		isLoading,
		streamingContent,
		handleSubmit,
		stop,
		reload,
		error,
	} = useChat();
	return getProviders().length === 0 ? (
		<AI tabs={false} />
	) : (
		<aside
			data-state={showChat}
			className="relative flex bg-border/10 max-w-3xl flex-col w-full h-full mx-auto chat  rounded-none shadow-none "
		>
			<Messages
				messages={messages}
				streamingContent={streamingContent}
				isLoading={isLoading}
				reload={reload}
				error={error}
			/>
			<section className=" flex flex-col gap-2 p-4 ">
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
