import { systemPrompt } from "@/consts/prompt";
import { createProvider } from "@/lib/ai/providers";
import { useAIConfigStore } from "@/store/aiConfig";
import { useTabsStore } from "@/store/tabs";
import {
	type UIMessage,
	convertToModelMessages,
	smoothStream,
	streamText,
} from "ai";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

type statusType = "submitted" | "streaming" | "ready" | "error";
export function useChat() {
	const apiKeys = useAIConfigStore((state) => state.apiKeys);
	const selectedModel = useAIConfigStore((state) => state.selectedModel);
	const setMessages = useAIConfigStore((state) => state.setMessages);
	const messages = useAIConfigStore((state) => state.messages);
	const contenxtFile = useAIConfigStore(
		useShallow((state) => state.contextFile),
	);
	const [status, setStatus] = useState<statusType>("ready");
	const [input, setInput] = useState("");
	const [error, setError] = useState("");
	const [streamingContent, setStreamingContent] = useState("");
	const controller = useRef<AbortController | null>(null);
	const currentTab = useTabsStore(useShallow((state) => state.getCurrentTab()));

	const handleStreamText = async (userContent: string) => {
		if (selectedModel.provider === null) {
			toast.error("Please select a model before sending a message.", {
				position: "top-left",
			});
			return;
		}
		if (userContent.trim() === "clear") {
			setMessages([]);
			setInput("");
			return;
		}
		if (userContent.trim() === "") return;
		const messagesToAI: UIMessage[] = [
			...messages,
			{
				id: Date.now().toString(),
				role: "user",
				parts: [
					{
						type: "text",
						text: userContent.trim(),
						state: "done",
					},
				],
			},
		];

		setMessages(messagesToAI);
		setInput("");
		try {
			const newController = new AbortController();
			controller.current = newController;
			setStatus("submitted");

			if (selectedModel.provider === null || selectedModel.id === null) return;

			const { textStream } = streamText({
				messages: convertToModelMessages(messagesToAI),
				system: systemPrompt(contenxtFile ? currentTab?.code : ""),
				model: createProvider(
					selectedModel.provider,
					apiKeys[selectedModel.provider],
				)(selectedModel.id),
				abortSignal: controller.current.signal,
				experimental_transform: smoothStream(),
			});
			setStatus("streaming");

			let fullResponse = "";
			for await (const chunk of textStream) {
				fullResponse += chunk;
				setStreamingContent(fullResponse);
			}
			if (fullResponse.length > 0) {
				setMessages((prev) => [
					...prev,
					{
						// id: Date.now().toString(),
						id: Date.now().toString(),
						role: "assistant",
						parts: [
							{
								text: fullResponse,
								type: "text",
							},
						],
					},
				]);
			}
		} catch (error) {
			setStatus("error");
			setError(String(error));
			let errorMessage = "Something went wrong";
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast.error("Error Generating Response", {
				description: errorMessage,
				position: "bottom-center",
				duration: 10000,
			});
			if (messages.at(-1)?.role === "user") {
				setMessages(messages.slice(0, -1));
			}
		} finally {
			setStatus("ready");
			setStreamingContent("");
		}
	};

	const handleSubmit = () => {
		handleStreamText(input);
	};

	const handleStop = () => {
		controller.current?.abort();
		controller.current = null;
	};

	const handleRegenerate = () => {
		const lastUserIndex = messages.map((m) => m.role).lastIndexOf("user");
		if (lastUserIndex === -1) return;
		setError("");
		const lastUserMessage = messages[lastUserIndex].parts.at(-1);
		// Elimina el último mensaje de assistant (si existe)
		setMessages((prev) => prev.slice(0, lastUserIndex + 1));
		if (typeof lastUserMessage !== "string") return;
		handleStreamText(lastUserMessage);
	};

	return {
		input,
		messages,
		setInput,
		setMessages,
		isLoading: status === "submitted" || status === "streaming",
		streamingContent,
		setStreamingContent,
		handleSubmit,
		stop: handleStop,
		reload: handleRegenerate,
		error,
		status,
	};
}
