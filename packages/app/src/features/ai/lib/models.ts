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
			{ id: "gpt-6-astra", name: "GPT-6 Astra" },
			{ id: "gpt-6.1-sol", name: "GPT-6.1 Sol" },
			{ id: "gpt-6.1-terra", name: "GPT-6.1 Terra" },
			{ id: "gpt-6-luna", name: "GPT-6 Luna" },
		],
	},
	anthropic: {
		name: "Anthropic",
		apiKeyUrl: "https://console.anthropic.com/settings/keys",
		icon: claude,
		models: [
			{ id: "claude-fable-5-2", name: "Claude Fable 5.2" },
			{ id: "claude-opus-5-5", name: "Claude Opus 5.5" },
			{ id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5" },
			{ id: "claude-haiku-5-5", name: "Claude Haiku 5.5" },
		],
	},
	google: {
		name: "Google",
		apiKeyUrl: "https://aistudio.google.com/apikey",
		icon: gemini,
		models: [
			{ id: "gemini-4-carbon", name: "Gemini 4 Carbon" },
			{ id: "gemini-4-argon", name: "Gemini 4 Argon" },
			{ id: "gemini-3.8-flash", name: "Gemini 3.8 Flash" },
			{ id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite" },
		],
	},
	mistral: {
		name: "Mistral",
		apiKeyUrl: "https://console.mistral.ai/api-keys",
		icon: mistral,
		models: [
			{ id: "mistral-large-4", name: "Mistral Large 4" },
			{ id: "mistral-small-2603", name: "Mistral Small 4" },
			{ id: "ministral-14b-2512", name: "Ministral 3 14B" },
			{ id: "zai-glm-5-3-flash", name: "Z.ai GLM 5.3 Flash" },
			{ id: "codestral-2508", name: "Codestral" },
		],
	},
} satisfies Record<string, ProvidersConfig>;
