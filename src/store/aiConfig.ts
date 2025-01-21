import { providersList } from "@/consts";
import type { ProviderItem, providers } from "@/types/ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIConfigStore {
  apiKeys: {
    openai: string;
    google: string;
    anthropic: string;
  };
  selectedModel: string;
  provider: providers;
  setProvider: (model: providers) => void;
  setApiKeys: (key: string, provider: providers) => void;
  getProviders: () => ProviderItem[];
  setSelectedModel: (provider: string) => void;
}

export const useAIConfigStore = create<AIConfigStore>()(
  persist(
    (set, get) => ({
      apiKeys: {
        openai: "",
        google: "",
        anthropic: "",
      },
      provider: "google",
      selectedModel: "",
      setSelectedModel: (selectedProvider) =>
        set({ selectedModel: selectedProvider }),
      setApiKeys: (key: string, provider: string) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        })),
      getProviders: () => {
        const apiKeys = get().apiKeys;
        return providersList.filter((provider) => apiKeys[provider.name]);
      },
      setProvider: (model) => set({ provider: model }),
    }),
    {
      name: "aiConfigStore",
    }
  )
);
