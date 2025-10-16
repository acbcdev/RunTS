import type { SVGProps } from "react";
import { claude, gemini, mistral, openai } from "@/features/common/svg/";

export type model = {
	id: string;
	name: string;
};

export type providers = "openai" | "google" | "anthropic" | "mistral";
export type Provider = { name: providers; url: string };

export const API_PROVIDERS: Provider[] = [
	{ name: "openai", url: "https://platform.openai.com/api-keys" },
	{ name: "google", url: "https://aistudio.google.com/apikey" },
	{ name: "anthropic", url: "https://console.anthropic.com/settings/keys" },
	{
		name: "mistral",
		url: "https://console.mistral.ai/api-keys",
	},
];

type providerType = "openai" | "google" | "anthropic" | "mistral";

const providers: Record<
	providerType,
	{
		models: model[];
		active: boolean;
		Icon: React.FC<SVGProps<SVGSVGElement>>;
	}
> = {
	openai: {
		models: [
			{ id: "gpt-5-mini", name: "GPT-5 mini" },
			{ id: "gpt-5", name: "GPT-5" },
			{ id: "gpt-5-nano", name: "GPT-5 nano" },
			{ id: "gpt-5-pro", name: "GPT-5 pro" },
			{ id: "gpt-5-codex", name: "GPT-5 Codex" },
		],
		active: true,
		Icon: openai,
	},
	google: {
		models: [
			{ id: "gemma-3-12b-it", name: "Gemma 3 12b " },
			{ id: "gemma-3-27b-it", name: "Gemma 3 27b " },
			{ id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
			{ id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
			{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
		],
		active: true,
		Icon: gemini,
	},
	anthropic: {
		models: [
			{ id: "claude-opus-4-20250514", name: "Claude Opus 4" },
			{ id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
			{ id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
		],
		active: true,
		Icon: claude,
	},
	mistral: {
		models: [
			{ id: "mistral-large-latest", name: "Mistral Large" },
			{ id: "pixtral-large-latest", name: "Pixtral Large" },
			{ id: "mistral-small-latest", name: "Mistral Small" },
		],
		active: true,
		Icon: mistral,
	},
};

export const models = Object.entries(providers)
	.flatMap(([provider, value]) =>
		value.models.map((model) => ({
			provider,
			...model,
			active: value.active,
			Icon: value.Icon,
		})),
	)
	.filter((models) => models.active);
