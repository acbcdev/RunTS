import {
	convertToModelMessages,
	generateText,
	type LanguageModel,
	smoothStream,
	streamText,
	type UIMessage,
} from "ai";
import { useAIConfigStore } from "../store/aiConfig";
import { createProvider } from "./providers";

// Single seam for every AI call in the app. Provider creation, model
// resolution and error normalisation live here — callers (chat, code-gen)
// consume one interface, not several SDKs.

type ProviderFactory = (modelId: string) => LanguageModel;

// Cache factories per connection so we don't re-import the SDK and
// re-instantiate the client on every call.
const factoryCache = new Map<string, Promise<ProviderFactory>>();

async function resolveModel(): Promise<LanguageModel> {
	const { providers, selectedModel } = useAIConfigStore.getState();
	const config = providers.find((p) => p.id === selectedModel.providerId);
	if (!config || !selectedModel.id) {
		throw new Error("No model selected");
	}

	const cacheKey = `${config.kind}:${config.baseURL}:${config.apiKey}`;
	let factory = factoryCache.get(cacheKey);
	if (!factory) {
		factory = createProvider(config);
		factoryCache.set(cacheKey, factory);
	}

	return (await factory)(selectedModel.id);
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
		instructions: opts.system,
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
