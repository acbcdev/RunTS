import { generateText } from "ai";
import { useAIConfigStore } from "../store/aiConfig";
import { cleanCodeResponse } from "./code-utils";
import { createProvider } from "./providers";

export async function getAICompletion(
  prefix: string,
  suffix: string,
  language: string,
): Promise<string> {
  const apiKeys = useAIConfigStore.getState().apiKeys;
  const selectedModel = useAIConfigStore.getState().selectedModel;

  if (!selectedModel.provider || !selectedModel.id) {
    throw new Error("No model selected");
  }

  const provider = await createProvider(
    selectedModel.provider,
    apiKeys[selectedModel.provider as keyof typeof apiKeys],
  );

  if (!provider) {
    throw new Error("Failed to create provider");
  }

  const prompt = `Complete the following ${language} code. Provide only the completion text without explanation.

Prefix: ${prefix}
Suffix: ${suffix}

Completion:`;

  const { text } = await generateText({
    model: provider(selectedModel.id),
    prompt,
  });

  return cleanCodeResponse(text);
}
