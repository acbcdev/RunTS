export type providers = "openai" | "google" | "anthropic" | "mistral";
export type model = {
	id: string;
	name: string;
};

export type OpenAIModel = "gpt-5" | "gpt-5-mini" | "gpt-5-nano";
export type GeminiModel =
	| "gemini-2.5-pro"
	| "gemini-2.5-flash"
	| "gemini-2.5-flash-lite"
	| "gemma-3-12b-it"
	| "gemma-3-27b-it";
export type MistralModel =
	| "mistral-large-latest"
	| "pixtral-large-latest"
	| "mistral-small-latest";
export type AnthropicModel =
	| "claude-3-sonnet-20240229"
	| "claude-3-5-haiku-latest"
	| "claude-3-7-sonnet-20250219"
	| "claude-opus-4-20250514"
	| "claude-sonnet-4-20250514";

export type SupportedModel =
	| OpenAIModel
	| MistralModel
	| GeminiModel
	| AnthropicModel;

export type Provider = { name: providers; url: string };
