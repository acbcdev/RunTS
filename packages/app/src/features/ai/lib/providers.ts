import type { providers } from "../types";

// Dynamically import AI SDK providers to reduce initial bundle size
// Each provider will be loaded only when selected by the user
export async function createProvider(provider: providers, apiKey: string) {
	switch (provider) {
		case "openai": {
			const { createOpenAI } = await import("@ai-sdk/openai");
			return createOpenAI({ apiKey });
		}
		case "anthropic": {
			const { createAnthropic } = await import("@ai-sdk/anthropic");
			return createAnthropic({ apiKey });
		}
		case "google": {
			const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
			return createGoogleGenerativeAI({ apiKey });
		}
		case "mistral": {
			const { createMistral } = await import("@ai-sdk/mistral");
			return createMistral({ apiKey });
		}
	}
}
