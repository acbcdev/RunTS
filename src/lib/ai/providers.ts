import type { providers } from "@/types/ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
const generativeAIProviders = {
	openai: createOpenAI,
	google: createGoogleGenerativeAI,
	anthropic: createAnthropic,
};
export function createProvider(provider: providers, apiKey: string) {
	return generativeAIProviders[provider]({ apiKey });
}
