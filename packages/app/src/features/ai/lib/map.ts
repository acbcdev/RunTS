// This file is now deprecated - use getProviderForModel from constants.ts instead
// Kept for backward compatibility only

import type { providers, SupportedModel } from "./constants";
import { getProviderForModel as getProvider } from "./constants";

/**
 * @deprecated Use getProviderForModel from constants.ts instead
 * Get provider name from model ID
 */
export function getProviderForModel(
  model: SupportedModel,
  showError = true
): providers {
  const provider = getProvider(model);

  if (!provider && showError) {
    throw new Error(`Unknown provider for model: ${model}`);
  }

  return provider as providers;
}
