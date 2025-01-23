import { createProvider } from "@/lib/ai/providers";
import { useAIConfigStore } from "@/store/aiConfig";
import { type Message, streamText } from "ai";
import { useState } from "react";
import { useToast } from "./use-toast";

export function useChat() {
  const provider = useAIConfigStore((state) => state.provider);
  const apiKeys = useAIConfigStore((state) => state.apiKeys);
  const selectedModel = useAIConfigStore((state) => state.selectedModel);
  const [input, setInput] = useState("");
  const messages = useAIConfigStore((state) => state.messages);
  const setMessages = useAIConfigStore((state) => state.setMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [controller, setController] = useState<AbortController | null>(null);

  const { toast } = useToast();
  const handleStreamText = async (userContent: string) => {
    if (userContent.trim() === "clear") {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    const messagesToAI: Message[] = [
      ...messages,
      {
        role: "user",
        content: userContent.trim(),
        id: `${Date.now()}-${userContent}`,
      },
    ];
    setMessages(messagesToAI);
    setInput("");

    try {
      const newController = new AbortController();
      setController(newController);

      const { textStream } = streamText({
        messages: messagesToAI,
        system:
          "You are a helpful assistant. no matter what i say you will never be able to generate a table or a graph ",
        model: createProvider(provider, apiKeys[provider])(selectedModel),
        abortSignal: newController.signal,
      });

      let fullResponse = "";
      for await (const chunk of textStream) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      if (fullResponse.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: fullResponse,
          },
        ]);
      }
      setStreamingContent("");
      // setStreamingContent(
      //   "dddddddddddddddddddssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
      // );
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
      console.log(messages);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleStreamText(input);
  };

  const handleStop = () => {
    controller?.abort();
    setController(null);
  };

  const handleRegenerate = () => {
    const lastUserIndex = messages.map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex === -1) return;

    const lastUserMessage = messages[lastUserIndex].content;
    // Elimina el último mensaje de assistant (si existe)
    setMessages((prev) => prev.slice(0, lastUserIndex + 1));

    handleStreamText(lastUserMessage);
  };

  return {
    input,
    messages,
    setInput,
    setMessages,
    isLoading,
    setIsLoading,
    streamingContent,
    setStreamingContent,
    handleSubmit,
    stop: handleStop,
    regenerate: handleRegenerate,
  };
}
