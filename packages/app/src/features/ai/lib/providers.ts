import type { LanguageModel } from "ai";
import type { providers } from "../types";

// Type for a provider factory function that creates LanguageModels
type ProviderFactory = (modelId: string) => LanguageModel;

// Dynamically import AI SDK providers to reduce initial bundle size
// Each provider will be loaded only when selected by the user
export async function createProvider(
  provider: providers,
  apiKey: string,
): Promise<ProviderFactory> {
  switch (provider) {
    case "openai": {
      const { createOpenAI } = await import("@ai-sdk/openai");
      const openai = createOpenAI({ apiKey });
      // The provider object is callable to create language models
      return ((modelId: string) =>
        openai(modelId) as unknown as LanguageModel) as ProviderFactory;
    }
    case "anthropic": {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      const anthropic = createAnthropic({ apiKey });
      return ((modelId: string) =>
        anthropic(modelId) as unknown as LanguageModel) as ProviderFactory;
    }
    case "google": {
      const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
      const google = createGoogleGenerativeAI({ apiKey });
      return ((modelId: string) =>
        google(modelId) as unknown as LanguageModel) as ProviderFactory;
    }
    case "mistral": {
      const { createMistral } = await import("@ai-sdk/mistral");
      const mistral = createMistral({ apiKey });
      return ((modelId: string) =>
        mistral(modelId) as unknown as LanguageModel) as ProviderFactory;
    }
    default: {
      throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
