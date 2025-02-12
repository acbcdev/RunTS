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
// google('')
// openai('o3-mini')
// openai("gpt-4o-2024-11-20");
// openai("gpt-4o-mini-2024-07-18");
// openai("o1-mini-2024-09-12");
// openai("o1-2024-12-17");

// anthropic("claude-3-sonnet-20240229");
// anthropic("claude-3-5-haiku-latest");

// google("gemini-2.0-flash-exp");
// google("gemini-1.5-pro-latest");
// google("gemini-1.5-flash-latest");
