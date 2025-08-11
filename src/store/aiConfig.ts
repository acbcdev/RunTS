import { models } from "@/consts";
import type { providers } from "@/types/ai";
import type { ModelMessage } from "ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIConfigStore {
  apiKeys: {
    openai: string;
    google: string;
    anthropic: string;
    mistral: string;
  };
  setApiKeys: (key: string, provider: providers) => void;
  messages: ModelMessage[];
  setMessages: (
    messages: ModelMessage[] | ((prev: ModelMessage[]) => ModelMessage[])
  ) => void;
  showChat: boolean;
  toggleChat: (size?: boolean) => void;
  selectedModel: {
    id: string | null;
    provider: providers | null;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  changeModel: ({ id, provider, Icon }: AIConfigStore["selectedModel"]) => void;
  getProviders: () => typeof models;
  contextFile: boolean;
  setContextFile: (contextFile: boolean) => void;
}

export const useAIConfigStore = create<AIConfigStore>()(
  persist(
    (set, get) => ({
      apiKeys: {
        openai: "",
        google: "",
        anthropic: "",
        mistral: "",
      },
      contextFile: true,
      setContextFile: (contextFile) => set({ contextFile }),
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
      selectedModel: {
        id: "",
        provider: null,
        Icon: undefined,
      },

      changeModel: ({ id, provider, Icon }) => {
        set((state) => ({
          selectedModel: {
            ...state.selectedModel,
            id,
            provider,
            Icon,
          },
        }));
      },

      getProviders: () => {
        const apiKeys = get().apiKeys;
        return models.filter((model) => apiKeys[model.provider as providers]);
      },
    }),
    {
      name: "aiConfigStore",
    }
  )
);
