import type { anthropic as anthropicProvider } from "@ai-sdk/anthropic";
import type { google as googleProvider } from "@ai-sdk/google";
import type { mistral as mistralProvider } from "@ai-sdk/mistral";
import type { openai as openaiProvider } from "@ai-sdk/openai";
import type { JSX, SVGProps } from "react";
import { claude, gemini, mistral, openai } from "@/features/common/svg/";

type OpenAIModelId = Parameters<typeof openaiProvider>[0];
type AnthropicModelId = Parameters<typeof anthropicProvider>[0];
type GoogleModelId = Parameters<typeof googleProvider>[0];
type MistralModelId = Parameters<typeof mistralProvider>[0];

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

export const PROVIDER_CONFIG = {
  openai: {
    name: "OpenAI",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    icon: openai,
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 Mini" },
      { id: "gpt-5-codex", name: "GPT-5 Codex" },
      { id: "gpt-5-nano", name: "GPT-5 Nano" },
      { id: "gpt-5-pro", name: "GPT-5 Pro" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    icon: claude,
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
      { id: "claude-opus-4-5", name: "Claude Opus 4.5" },
    ],
  },
  google: {
    name: "Google",
    apiKeyUrl: "https://aistudio.google.com/apikey",
    icon: gemini,
    models: [
      // { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      // { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      // { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemma-3-27b-it", name: "Gemma 3.27B" },
      { id: "gemma-3-8b-it", name: "Gemma 3.8B" },
      { id: "gemini-flash-latest", name: "Gemini Flash Latest" },
      { id: "gemini-pro-latest", name: "Gemini Pro Latest" },
      { id: "gemini-flash-lite-latest", name: "Gemini Flash Lite Latest" },
    ],
  },
  mistral: {
    name: "Mistral",
    apiKeyUrl: "https://console.mistral.ai/api-keys",
    icon: mistral,
    models: [
      { id: "mistral-large-latest", name: "Mistral Large" },
      { id: "mistral-small-latest", name: "Mistral Small" },
      { id: "pixtral-large-latest", name: "Pixtral Large" },
    ],
  },
} satisfies Record<string, ProvidersConfig>;

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
  }))
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
