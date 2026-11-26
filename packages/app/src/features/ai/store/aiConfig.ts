import type { UIMessage } from "ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PRESETS, type PresetId, type ProviderConfig } from "../lib/constants";
import { createEncryptedStorageSync } from "../lib/encryptedStorage";

type SelectedModel = { providerId: string | null; id: string | null };

interface AIConfigStore {
	providers: ProviderConfig[];
	saveProvider: (provider: ProviderConfig) => void;
	removeProvider: (id: string) => void;
	messages: UIMessage[];
	setMessages: (
		messages: UIMessage[] | ((prev: UIMessage[]) => UIMessage[]),
	) => void;
	showChat: boolean;
	toggleChat: (size?: boolean) => void;
	selectedModel: SelectedModel;
	changeModel: (model: SelectedModel) => void;
	contextFile: boolean;
	setContextFile: (contextFile: boolean) => void;
}

/** Flatten every provider's visible models for the selectors. */
export function visibleModels(providers: ProviderConfig[]) {
	return providers.flatMap((p) =>
		p.models.map((id) => ({ providerId: p.id, id, provider: p })),
	);
}

// v0 stored one key per hardcoded provider; v1 stores a list of connections.
const V0_PRESET: Record<string, PresetId> = {
	openai: "openai",
	anthropic: "anthropic",
	google: "gemini",
	mistral: "mistral",
};

export function migrateV0(state: {
	apiKeys?: Record<string, string>;
	selectedModel?: { id?: string | null; provider?: string | null };
}) {
	const { apiKeys = {}, selectedModel, ...rest } = state;
	const providers: ProviderConfig[] = Object.entries(apiKeys)
		.filter(([name, key]) => key && V0_PRESET[name])
		.map(([name, apiKey]) => {
			const preset = PRESETS[V0_PRESET[name]];
			const models = [...(preset.models ?? [])];
			if (
				selectedModel?.provider === name &&
				selectedModel.id &&
				!models.includes(selectedModel.id)
			) {
				models.unshift(selectedModel.id);
			}
			return {
				id: name,
				kind: preset.kind,
				preset: V0_PRESET[name],
				name: preset.name,
				baseURL: preset.baseURL,
				apiKey,
				models,
			};
		});
	const keep = providers.some((p) => p.id === selectedModel?.provider);
	return {
		...rest,
		providers,
		selectedModel: keep
			? {
					providerId: selectedModel?.provider ?? null,
					id: selectedModel?.id ?? null,
				}
			: { providerId: null, id: null },
	};
}

export const useAIConfigStore = create<AIConfigStore>()(
	persist(
		(set) => ({
			providers: [],
			contextFile: true,
			messages: [],
			showChat: false,
			selectedModel: { providerId: null, id: null },
			setContextFile: (contextFile) => set({ contextFile }),
			setMessages: (messages) =>
				set((state) => ({
					messages:
						typeof messages === "function"
							? messages(state.messages)
							: messages,
				})),
			saveProvider: (provider) =>
				set((state) => {
					const exists = state.providers.some((p) => p.id === provider.id);
					const providers = exists
						? state.providers.map((p) => (p.id === provider.id ? provider : p))
						: [...state.providers, provider];
					const { selectedModel } = state;
					const current = providers.find(
						(p) => p.id === selectedModel.providerId,
					);
					// Keep the selection valid: fall back to this provider's first model.
					const stillValid = current?.models.includes(selectedModel.id ?? "");
					return {
						providers,
						selectedModel: stillValid
							? selectedModel
							: { providerId: provider.id, id: provider.models[0] ?? null },
					};
				}),
			removeProvider: (id) =>
				set((state) => {
					const providers = state.providers.filter((p) => p.id !== id);
					if (state.selectedModel.providerId !== id) return { providers };
					const next = visibleModels(providers)[0];
					return {
						providers,
						selectedModel: {
							providerId: next?.providerId ?? null,
							id: next?.id ?? null,
						},
					};
				}),
			toggleChat: (showChat) => {
				if (showChat === undefined) {
					set((state) => ({
						showChat: !state.showChat,
					}));
					return;
				}
				set({ showChat });
			},
			changeModel: (selectedModel) => set({ selectedModel }),
		}),
		{
			name: "aiConfigStore-v2",
			version: 1,
			migrate: (state, version) =>
				(version === 0
					? migrateV0(state as Parameters<typeof migrateV0>[0])
					: state) as AIConfigStore,
			storage: createJSONStorage(() => createEncryptedStorageSync()),
		},
	),
);
