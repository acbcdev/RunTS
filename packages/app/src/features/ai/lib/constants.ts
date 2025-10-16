import { claude, gemini, mistral, openai } from "@/features/common/svg/";

// ============================================================================
// SIMPLE MODEL CONFIGURATION - Only edit this section to add/remove models
// All types are auto-generated from this config for perfect autocomplete!
// ============================================================================

export const PROVIDER_CONFIG = {
  openai: {
    name: "OpenAI" as const,
    apiKeyUrl: "https://platform.openai.com/api-keys" as const,
    icon: openai,
    models: {
      "gpt-5": { name: "GPT-5" },
      "gpt-5-mini": { name: "GPT-5 Mini" },
      "gpt-5-nano": { name: "GPT-5 Nano" },
      "gpt-5-codex": { name: "GPT-5 Codex" },
      "gpt-5-pro": { name: "GPT-5 Pro" },
    },
  },
  anthropic: {
    name: "Anthropic" as const,
    apiKeyUrl: "https://console.anthropic.com/settings/keys" as const,
    icon: claude,
    models: {
      "claude-sonnet-4-5": { name: "Claude Sonnet 4.5" },
      "claude-4-5-haiku": { name: "Claude Haiku 4.5" },
    },
  },
  google: {
    name: "Google" as const,
    apiKeyUrl: "https://aistudio.google.com/apikey" as const,
    icon: gemini,
    models: {
      "gemini-2.5-pro": { name: "Gemini 2.5 Pro" },
      "gemini-2.5-flash": { name: "Gemini 2.5 Flash" },
      "gemini-2.5-flash-lite": { name: "Gemini 2.5 Flash Lite" },
      "gemma-3-12b-it": { name: "Gemma 3 12B" },
      "gemma-3-27b-it": { name: "Gemma 3 27B" },
    },
  },
  mistral: {
    name: "Mistral" as const,
    apiKeyUrl: "https://console.mistral.ai/api-keys" as const,
    icon: mistral,
    models: {
      "mistral-large-latest": { name: "Mistral Large" },
      "mistral-small-latest": { name: "Mistral Small" },
      "pixtral-large-latest": { name: "Pixtral Large" },
    },
  },
} as const;

// ============================================================================
// Auto-generated types (DO NOT EDIT) - Perfect autocomplete & type safety!
// ============================================================================

// Provider names: "openai" | "anthropic" | "google" | "mistral"
export type ProviderName = keyof typeof PROVIDER_CONFIG;
export type providers = ProviderName;

// All model IDs across all providers with full type safety
export type OpenAIModel = keyof (typeof PROVIDER_CONFIG)["openai"]["models"];
export type AnthropicModel =
  keyof (typeof PROVIDER_CONFIG)["anthropic"]["models"];
export type GoogleModel = keyof (typeof PROVIDER_CONFIG)["google"]["models"];
export type MistralModel = keyof (typeof PROVIDER_CONFIG)["mistral"]["models"];

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

// ============================================================================
// Runtime exports for UI components
// ============================================================================

// API Providers list for settings UI
export const API_PROVIDERS: Provider[] = (
  Object.entries(PROVIDER_CONFIG) as [
    ProviderName,
    (typeof PROVIDER_CONFIG)[ProviderName]
  ][]
).map(([key, config]) => ({
  name: key,
  url: config.apiKeyUrl,
}));

// Flattened models list for model selector UI
export const models = (
  Object.entries(PROVIDER_CONFIG) as [
    ProviderName,
    (typeof PROVIDER_CONFIG)[ProviderName]
  ][]
).flatMap(([provider, config]) =>
  Object.entries(config.models).map(([id, modelData]) => ({
    provider,
    id,
    name: modelData.name,
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
    (typeof PROVIDER_CONFIG)[ProviderName]
  ][]) {
    if (modelId in config.models) {
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
  const modelData = config.models[modelId as keyof typeof config.models];
  return modelData?.name ?? modelId;
}
