import { useChat } from "@/hooks/useChat";
import MultiModalInput from "./core/MultiModal-Input";

import { AI } from "@/components/Settings/tabs/ai";
import { useAIConfigStore } from "@/store/aiConfig";
import { useShallow } from "zustand/react/shallow";
import { Messages } from "./core/Messages";
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
			className="relative flex bg-border/10 border-r-2 border-accent/5 flex-col w-full h-full max-w-3xl mx-auto chat  rounded-none shadow-none "
		>
			<Messages
				messages={messages}
				streamingContent={streamingContent}
				isLoading={isLoading}
				reload={reload}
				error={error}
			/>
			<section className=" flex flex-col gap-2 p-4 ">
				<MultiModalInput
					input={input}
					stop={stop}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					setInput={setInput}
				/>
			</section>
		</aside>
	);
}
