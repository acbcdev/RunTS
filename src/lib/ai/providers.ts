import type { providers } from "@/types/ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createMistral } from "@ai-sdk/mistral";

const generativeAIProviders = {
	openai: createOpenAI,
	google: createGoogleGenerativeAI,
	anthropic: createAnthropic,
	mistral: createMistral,
};
export function createProvider(provider: providers, apiKey: string) {
	return generativeAIProviders[provider]({ apiKey });
}
