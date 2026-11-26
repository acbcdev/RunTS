import type { LanguageModel } from "ai";
import type { ProviderConfig } from "./constants";

type ProviderFactory = (modelId: string) => LanguageModel;

// SDKs are imported lazily so they stay out of the initial bundle.
export async function createProvider(
	config: ProviderConfig,
): Promise<ProviderFactory> {
	if (config.kind === "anthropic") {
		const { createAnthropic } = await import("@ai-sdk/anthropic");
		const anthropic = createAnthropic({
			apiKey: config.apiKey,
			baseURL: config.baseURL,
			headers: { "anthropic-dangerous-direct-browser-access": "true" },
		});
		return (modelId) => anthropic(modelId) as unknown as LanguageModel;
	}
	const { createOpenAI } = await import("@ai-sdk/openai");
	const openai = createOpenAI({
		baseURL: config.baseURL,
		// Local servers ignore the key, but the SDK requires one.
		apiKey: config.apiKey || "none",
	});
	// .chat() → /chat/completions. The default (Responses API) only exists on OpenAI.
	// Cast: SDK packages pin different @ai-sdk/provider versions.
	return (modelId) => openai.chat(modelId) as unknown as LanguageModel;
}
