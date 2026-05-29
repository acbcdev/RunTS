import {
	convertToModelMessages,
	generateText,
	type LanguageModel,
	smoothStream,
	streamText,
	type UIMessage,
} from "ai";
import { useAIConfigStore } from "../store/aiConfig";
import type { providers } from "../types";
import { createProvider } from "./providers";

// Single seam for every AI call in the app. Provider creation, API-key
// lookup, model resolution and error normalisation live here — callers
// (chat, code-gen, completions) consume one interface, not four SDKs.

type ProviderFactory = (modelId: string) => LanguageModel;

// Cache provider factories by provider+key so we don't re-import the SDK
// and re-instantiate the client on every keystroke / call.
const factoryCache = new Map<string, Promise<ProviderFactory>>();

async function resolveModel(): Promise<LanguageModel> {
	const { provider, id } = useAIConfigStore.getState().selectedModel;
	if (!provider || !id) {
		throw new Error("No model selected");
	}

	const apiKey = useAIConfigStore.getState().apiKeys[provider];
	if (!apiKey) {
		throw new Error(`No API key configured for ${provider}`);
	}

	const cacheKey = `${provider}:${apiKey}`;
	let factory = factoryCache.get(cacheKey);
	if (!factory) {
		factory = createProvider(provider as providers, apiKey);
		factoryCache.set(cacheKey, factory);
	}

	return (await factory)(id);
}

/** Stream a chat completion for the current model. */
export async function aiStream(opts: {
	messages: UIMessage[];
	system: string;
	abortSignal?: AbortSignal;
}) {
	const model = await resolveModel();
	return streamText({
		model,
		messages: await convertToModelMessages(opts.messages),
		system: opts.system,
		abortSignal: opts.abortSignal,
		experimental_transform: smoothStream(),
	});
}

/** One-shot text generation for the current model. */
export async function aiGenerate(prompt: string): Promise<string> {
	const model = await resolveModel();
	const { text } = await generateText({ model, prompt });
	return text;
}
