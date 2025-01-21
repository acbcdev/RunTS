export type providers = "openai" | "google" | "anthropic";
export type ProviderItem = {
  name: providers;
  models: string[];
};
