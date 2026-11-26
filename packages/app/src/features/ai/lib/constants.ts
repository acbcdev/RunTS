import { Cpu } from "lucide-react";
import type { ComponentType } from "react";
import {
	claude,
	gemini,
	lmstudio,
	mistral,
	ollama,
	openai,
	openrouter,
} from "@/features/common/svg/";

// Two wire protocols cover every provider: Anthropic's own API and the
// OpenAI-compatible /v1 API (OpenAI, Gemini, Mistral, OpenRouter, Ollama…).
export type ProviderKind = "anthropic" | "openai-compatible";

export type PresetId =
	| "anthropic"
	| "openrouter"
	| "openai"
	| "gemini"
	| "mistral"
	| "ollama"
	| "lmstudio"
	| "custom";

export type ProviderConfig = {
	id: string;
	kind: ProviderKind;
	preset: PresetId;
	name: string;
	baseURL: string;
	apiKey: string;
	/** Model ids shown in the selectors. */
	models: string[];
};

type Preset = {
	kind: ProviderKind;
	name: string;
	baseURL: string;
	icon: ComponentType<{ className?: string }>;
	keyUrl?: string;
	keyPlaceholder?: string;
	/** Runs on the user's machine: key optional, needs CORS allowed. */
	local?: boolean;
	/** Shown in the selector before the connection is tested. */
	models?: string[];
};

export const PRESETS: Record<PresetId, Preset> = {
	anthropic: {
		kind: "anthropic",
		name: "Anthropic",
		baseURL: "https://api.anthropic.com/v1",
		icon: claude,
		keyUrl: "https://console.anthropic.com/settings/keys",
		keyPlaceholder: "sk-ant-...",
		models: ["claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5"],
	},
	openrouter: {
		kind: "openai-compatible",
		name: "OpenRouter",
		baseURL: "https://openrouter.ai/api/v1",
		icon: openrouter,
		keyUrl: "https://openrouter.ai/settings/keys",
		keyPlaceholder: "sk-or-...",
	},
	openai: {
		kind: "openai-compatible",
		name: "OpenAI",
		baseURL: "https://api.openai.com/v1",
		icon: openai,
		keyUrl: "https://platform.openai.com/api-keys",
		keyPlaceholder: "sk-...",
		models: ["gpt-6.1-sol", "gpt-6.1-terra", "gpt-6-luna"],
	},
	gemini: {
		kind: "openai-compatible",
		name: "Gemini",
		baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
		icon: gemini,
		keyUrl: "https://aistudio.google.com/apikey",
		models: ["gemini-4-carbon", "gemini-3.8-flash"],
	},
	mistral: {
		kind: "openai-compatible",
		name: "Mistral",
		baseURL: "https://api.mistral.ai/v1",
		icon: mistral,
		keyUrl: "https://console.mistral.ai/api-keys",
		models: ["mistral-large-4", "codestral-2508"],
	},
	ollama: {
		kind: "openai-compatible",
		name: "Ollama",
		baseURL: "http://localhost:11434/v1",
		icon: ollama,
		local: true,
	},
	lmstudio: {
		kind: "openai-compatible",
		name: "LM Studio",
		baseURL: "http://localhost:1234/v1",
		icon: lmstudio,
		local: true,
	},
	custom: {
		kind: "openai-compatible",
		name: "OpenAI compatible",
		baseURL: "",
		icon: Cpu,
	},
};

/** Chips inside the "OpenAI compatible" form. */
export const COMPATIBLE_PRESETS: PresetId[] = [
	"ollama",
	"lmstudio",
	"openai",
	"gemini",
	"mistral",
];

/** Rows of the "Add provider" list. */
export const ADD_PROVIDER_OPTIONS: { preset: PresetId; description: string }[] =
	[
		{ preset: "anthropic", description: "Claude direct, with your API key." },
		{
			preset: "openrouter",
			description: "One key for models from many providers.",
		},
		{
			preset: "custom",
			description: "Ollama, LM Studio, OpenAI, Gemini, Mistral or any /v1 URL.",
		},
	];

/** Fetch the model ids a provider exposes. Throws on network/HTTP errors. */
export async function listModels(
	config: Pick<ProviderConfig, "kind" | "baseURL" | "apiKey">,
): Promise<string[]> {
	const base = config.baseURL.replace(/\/+$/, "");
	const headers: Record<string, string> =
		config.kind === "anthropic"
			? {
					"x-api-key": config.apiKey,
					"anthropic-version": "2023-06-01",
					"anthropic-dangerous-direct-browser-access": "true",
				}
			: config.apiKey
				? { Authorization: `Bearer ${config.apiKey}` }
				: {};
	const res = await fetch(`${base}/models`, { headers });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const json: { data?: { id: string }[] } = await res.json();
	// Gemini's compat endpoint prefixes ids with "models/".
	return (json.data ?? []).map((m) => m.id.replace(/^models\//, ""));
}
