import { providersList } from "@/consts";
import type { ProviderItem, providers } from "@/types/ai";
import type { Message } from "ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIConfigStore {
  apiKeys: {
    openai: string;
    google: string;
    anthropic: string;
  };
  setApiKeys: (key: string, provider: providers) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  showChat: boolean;
  toggleChat: (size?: boolean) => void;
  selectedModel: string;
  setSelectedModel: (provider: string) => void;
  provider: providers;
  setProvider: (model: providers) => void;
  getProviders: () => ProviderItem[];
}

export const useAIConfigStore = create<AIConfigStore>()(
  persist(
    (set, get) => ({
      apiKeys: {
        openai: "",
        google: "",
        anthropic: "",
      },
      messages: [],
      setMessages: (messages) =>
        set((state) => ({
          messages:
            typeof messages === "function"
              ? messages(state.messages)
              : messages,
        })),
      setApiKeys: (key: string, provider: string) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        })),
      showChat: false,

      toggleChat: (showChat) => {
        if (showChat === undefined) {
          set((state) => ({
            showChat: !state.showChat,
          }));
          return;
        }
        set({ showChat });
      },
      selectedModel: "",
      setSelectedModel: (selectedProvider) =>
        set({ selectedModel: selectedProvider }),
      provider: "google",
      setProvider: (model) => set({ provider: model }),

      getProviders: () => {
        const apiKeys = get().apiKeys;
        return providersList.filter((provider) => apiKeys[provider.name]);
      },
    }),
    {
      name: "aiConfigStore",
    }
  )
);
