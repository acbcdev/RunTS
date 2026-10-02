import type { UIMessage } from "ai";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { aiStream } from "../lib/ai";
import { useAIConfigStore } from "../store/aiConfig";
import { systemPrompt } from "./prompt";

type statusType = "submitted" | "streaming" | "ready" | "error";
export function useChat() {
	const selectedModel = useAIConfigStore((state) => state.selectedModel);
	const setMessages = useAIConfigStore((state) => state.setMessages);
	const messages = useAIConfigStore((state) => state.messages);
	const contenxtFile = useAIConfigStore(
		useShallow((state) => state.contextFile),
	);
	const customInstructions = useAIConfigStore(
		(state) => state.customInstructions,
	);
	const [status, setStatus] = useState<statusType>("ready");
	const [input, setInput] = useState("");
	const [error, setError] = useState("");
	const controller = useRef<AbortController | null>(null);
	const currentTab = useTabsStore(useShallow((state) => state.getCurrentTab()));

	const patchMessage = (
		id: string,
		text: string,
		state: "streaming" | "done",
	) => {
		setMessages((prev) => {
			const last = prev.at(-1);
			const part = { type: "text" as const, text, state };
			if (!last || last.id !== id) {
				return [...prev, { id, role: "assistant", parts: [part] }];
			}
			return prev.map((msg) =>
				msg.id === id ? { ...msg, parts: [part] } : msg,
			);
		});
	};

	const handleStreamText = async (
		userContent: string,
		history: UIMessage[] = messages,
	) => {
		if (selectedModel.provider === null) {
			toast.error("Please select a model before sending a message.", {
				position: "top-left",
			});
			return;
		}
		if (userContent.trim() === "/clear") {
			setMessages([]);
			setInput("");
			return;
		}
		if (userContent.trim() === "") return;
		const messagesToAI: UIMessage[] = [
			...history,
			{
				id: crypto.randomUUID(),
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
		setError("");
		const id = crypto.randomUUID();
		let accumulatedText = "";
		try {
			const newController = new AbortController();
			controller.current = newController;
			setStatus("submitted");

			if (selectedModel.provider === null || selectedModel.id === null) return;
			const { textStream } = await aiStream({
				messages: messagesToAI,
				system: systemPrompt(
					contenxtFile ? currentTab?.code : "",
					customInstructions,
				),
				abortSignal: controller.current.signal,
			});
			setStatus("streaming");
			for await (const chunk of textStream) {
				accumulatedText += chunk;
				patchMessage(id, accumulatedText, "streaming");
			}

			// Marcar el mensaje como completado
			patchMessage(id, accumulatedText, "done");
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				// Cortado por el usuario: dejar lo que llegó como mensaje final
				if (accumulatedText) patchMessage(id, accumulatedText, "done");
				return;
			}
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
			// Devolver el prompt al input y sacar la pregunta sin respuesta
			setInput(userContent);
			setMessages((prev) =>
				prev.at(-1)?.role === "user" ? prev.slice(0, -1) : prev,
			);
		} finally {
			setStatus((prev) => (prev === "error" ? prev : "ready"));
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
		const lastPart = messages[lastUserIndex].parts.at(-1);
		if (!lastPart || lastPart.type !== "text") return;
		// handleStreamText re-agrega el user message, así que pasamos el historial sin él
		handleStreamText(lastPart.text, messages.slice(0, lastUserIndex));
	};

	return {
		input,
		messages,
		setInput,
		setMessages,
		isLoading: status === "submitted" || status === "streaming",
		handleSubmit,
		stop: handleStop,
		reload: handleRegenerate,
		error,
		status,
	};
}
