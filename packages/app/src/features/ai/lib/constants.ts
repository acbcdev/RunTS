import {
	type AnthropicModelId,
	type GoogleModelId,
	type MistralModelId,
	type OpenAIModelId,
	PROVIDER_CONFIG,
} from "./models";

// Provider names: "openai" | "anthropic" | "google" | "mistral"
export type ProviderName = keyof typeof PROVIDER_CONFIG;
export type providers = ProviderName;
// Model ID types inferred from AI SDK providers
export type OpenAIModel = OpenAIModelId;
export type AnthropicModel = AnthropicModelId;
export type GoogleModel = GoogleModelId;
export type MistralModel = MistralModelId;

// Union of all supported model IDs
export type SupportedModel =
	| OpenAIModel
	| AnthropicModel
	| GoogleModel
	| MistralModel;

// Legacy type aliases for backward compatibility
export type GeminiModel = GoogleModel;

export type model = {
	id: string;
	name: string;
};

export type Provider = {
	name: providers;
	url: string;
};

// API Providers list for settings UI
export const API_PROVIDERS: Provider[] = (
	Object.entries(PROVIDER_CONFIG) as [
		ProviderName,
		(typeof PROVIDER_CONFIG)[ProviderName],
	][]
).map(([key, config]) => ({
	name: key,
	url: config.apiKeyUrl,
}));

// Flattened models list for model selector UI
export const models = (
	Object.entries(PROVIDER_CONFIG) as [
		ProviderName,
		(typeof PROVIDER_CONFIG)[ProviderName],
	][]
).flatMap(([provider, config]) =>
	config.models.map((modelConfig) => ({
		provider,
		id: modelConfig.id,
		name: modelConfig.name,
		Icon: config.icon,
		active: true,
	})),
);

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Get provider name from model ID
 * @example getProviderForModel("gpt-4o") // "openai"
 * @example getProviderForModel("claude-3-5-sonnet-20241022") // "anthropic"
 */
export function getProviderForModel(modelId: string): providers | null {
	for (const [provider, config] of Object.entries(PROVIDER_CONFIG) as [
		ProviderName,
		(typeof PROVIDER_CONFIG)[ProviderName],
	][]) {
		if (config.models.some((model) => model.id === modelId)) {
			return provider;
		}
	}
	return null;
}

/**
 * Check if a model ID is valid
 * @example isValidModel("gpt-4o") // true
 * @example isValidModel("invalid-model") // false
 */
export function isValidModel(modelId: string): modelId is SupportedModel {
	return getProviderForModel(modelId) !== null;
}

/**
 * Get model display name
 * @example getModelName("gpt-4o") // "GPT-4o"
 */
export function getModelName(modelId: SupportedModel): string {
	const provider = getProviderForModel(modelId);
	if (!provider) return modelId;

	const config = PROVIDER_CONFIG[provider];
	const modelData = config.models.find((model) => model.id === modelId);
	return modelData?.name ?? modelId;
}

export { PROVIDER_CONFIG };
