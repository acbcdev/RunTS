import type { anthropic as anthropicProvider } from "@ai-sdk/anthropic";
import type { google as googleProvider } from "@ai-sdk/google";
import type { mistral as mistralProvider } from "@ai-sdk/mistral";
import type { openai as openaiProvider } from "@ai-sdk/openai";
import type { JSX, SVGProps } from "react";
import { claude, gemini, mistral, openai } from "@/features/common/svg/";

export type OpenAIModelId = Parameters<typeof openaiProvider>[0];
export type AnthropicModelId = Parameters<typeof anthropicProvider>[0];
export type GoogleModelId = Parameters<typeof googleProvider>[0];
export type MistralModelId = Parameters<typeof mistralProvider>[0];

type supportedModelIds =
	| OpenAIModelId
	| AnthropicModelId
	| GoogleModelId
	| MistralModelId;

type ModelConfigEntry = {
	id: supportedModelIds;
	name: string;
};

type ProvidersConfig = {
	name: string;
	apiKeyUrl: string;
	icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
	models: ModelConfigEntry[];
};

type ProvidersConfigMap = Record<string, ProvidersConfig>;

export const PROVIDER_CONFIG: ProvidersConfigMap = {
	openai: {
		name: "OpenAI",
		apiKeyUrl: "https://platform.openai.com/api-keys",
		icon: openai,
		models: [
			{ id: "gpt-6.1-sol", name: "GPT-6.1 Sol" },
			{ id: "gpt-6-sol", name: "GPT-6 Sol" },
			{ id: "gpt-6-luna", name: "GPT-6 Luna" },
			{ id: "gpt-6-astra", name: "GPT-6 Astra" },
			{ id: "gpt-5.5", name: "GPT-5.5" },
		],
	},
	anthropic: {
		name: "Anthropic",
		apiKeyUrl: "https://console.anthropic.com/settings/keys",
		icon: claude,
		models: [
			{ id: "claude-fable-5-1", name: "Claude Fable 5.1" },
			{ id: "claude-opus-5-5", name: "Claude Opus 5.5" },
			{ id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5" },
			{ id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
		],
	},
	google: {
		name: "Google",
		apiKeyUrl: "https://aistudio.google.com/apikey",
		icon: gemini,
		models: [
			{ id: "gemini-3.8-flash", name: "Gemini 3.8 Flash" },
			{ id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite" },
			{ id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Preview)" },
			{ id: "gemini-pro-latest", name: "Gemini Pro Latest" },
			{ id: "gemini-flash-latest", name: "Gemini Flash Latest" },
			{ id: "gemini-flash-lite-latest", name: "Gemini Flash Lite Latest" },
			{ id: "gemma-3-27b-it", name: "Gemma 3 27B" },
			{ id: "gemma-3-12b-it", name: "Gemma 3 12B" },
		],
	},
	mistral: {
		name: "Mistral",
		apiKeyUrl: "https://console.mistral.ai/api-keys",
		icon: mistral,
		models: [
			{ id: "mistral-large-latest", name: "Mistral Large" },
			{ id: "mistral-medium-latest", name: "Mistral Medium" },
			{ id: "mistral-small-latest", name: "Mistral Small" },
			{ id: "magistral-medium-latest", name: "Magistral Medium" },
			{ id: "codestral-latest", name: "Codestral" },
		],
	},
} satisfies Record<string, ProvidersConfig>;
