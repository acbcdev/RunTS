import { ExternalLink, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/features/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/features/ui/empty";
import { Input } from "@/features/ui/input";
import { API_PROVIDERS, models } from "../lib/constants";
import { useAIConfigStore } from "../store/aiConfig";
import type { providers } from "../types";

const LABELS: Record<string, string> = {
	google: "Google Gemini",
	anthropic: "Anthropic Claude",
	openai: "OpenAI",
	mistral: "Mistral",
};

export function NoProvidersView() {
	const [provider, setProvider] = useState<providers>(API_PROVIDERS[0].name);
	const [key, setKey] = useState("");
	const setApiKeys = useAIConfigStore((state) => state.setApiKeys);
	const changeModel = useAIConfigStore((state) => state.changeModel);
	const hasModel = useAIConfigStore((state) => !!state.selectedModel.id);
	const current = API_PROVIDERS.find((p) => p.name === provider);

	const connect = (event: React.FormEvent) => {
		event.preventDefault();
		if (!key.trim()) return;
		setApiKeys(key.trim(), provider);
		// Chat needs a model; pick the provider's first one if none is set.
		const model = models.find((m) => m.provider === provider);
		if (model && !hasModel) {
			changeModel({ id: model.id, provider, Icon: model.Icon });
		}
	};

	return (
		<Empty className="h-full border-r">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<KeyRound />
				</EmptyMedia>
				<EmptyTitle>Connect your AI</EmptyTitle>
				<EmptyDescription>
					Paste an API key and chat with your code.
				</EmptyDescription>
			</EmptyHeader>
			<div
				role="radiogroup"
				aria-label="Provider"
				className="grid w-full max-w-sm grid-cols-2 gap-2"
			>
				{API_PROVIDERS.map(({ name }) => (
					<Button
						key={name}
						type="button"
						role="radio"
						aria-checked={name === provider}
						variant="outline"
						size="sm"
						className="aria-checked:border-accent aria-checked:text-foreground text-muted-foreground"
						onClick={() => setProvider(name)}
					>
						{LABELS[name] ?? name}
					</Button>
				))}
			</div>
			<form onSubmit={connect} className="flex w-full max-w-sm flex-col gap-2">
				<Input
					type="password"
					autoComplete="off"
					spellCheck={false}
					aria-label="API key"
					placeholder={`${LABELS[provider] ?? provider} API key`}
					value={key}
					onChange={(event) => setKey(event.target.value)}
				/>
				<Button type="submit" disabled={!key.trim()}>
					Connect
				</Button>
			</form>
			<Button asChild variant="link" size="sm">
				<a href={current?.url} target="_blank" rel="noopener noreferrer">
					Get a {LABELS[provider] ?? provider} key
					<ExternalLink className="opacity-60" />
				</a>
			</Button>
			<p className="text-xs text-muted-foreground">
				Keys stay local, stored in your browser.
			</p>
		</Empty>
	);
}

export default NoProvidersView;
