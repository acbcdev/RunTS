import type { providers, SupportedModel } from "../types";

// map each model ID to its provider
const MODEL_PROVIDER_MAP: Record<SupportedModel, providers> = {
  "gpt-5": "openai",
  "gpt-5-mini": "openai",
  "gpt-5-nano": "openai",
  // Mistral
  "mistral-large-latest": "mistral",
  "mistral-small-latest": "mistral",
  "pixtral-large-latest": "mistral",

  // Google
  "gemini-2.5-pro": "google",
  "gemini-2.5-flash": "google",
  "gemini-2.5-flash-lite": "google",
  "gemma-3-12b-it": "google",
  "gemma-3-27b-it": "google",
  // Anthropic
  "claude-3-sonnet-20240229": "anthropic",
  "claude-3-5-haiku-latest": "anthropic",
  "claude-3-7-sonnet-20250219": "anthropic",
  "claude-opus-4-20250514": "anthropic",
  "claude-sonnet-4-20250514": "anthropic",
};

export function getProviderForModel(
  model: SupportedModel,
  showError = true
): providers {
  const provider = MODEL_PROVIDER_MAP[model];

  if (!provider && showError) {
    throw new Error(`Unknown provider for model: ${model}`);
  }

  return provider;
}
