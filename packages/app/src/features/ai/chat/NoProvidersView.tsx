import { ExternalLink, KeyRound } from "lucide-react";
import { Button } from "@/features/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/features/ui/empty";
import { API_PROVIDERS } from "../lib/constants";

const LABELS: Record<string, string> = {
	google: "Google Gemini",
	anthropic: "Anthropic Claude",
	openai: "OpenAI",
	mistral: "Mistral",
};

export function NoProvidersView() {
	return (
		<Empty className="h-full border-r">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<KeyRound />
				</EmptyMedia>
				<EmptyTitle>Connect your AI</EmptyTitle>
				<EmptyDescription>
					1. Get an API key from a provider.
					<br />
					2. Paste it in Settings {">"} AI.
				</EmptyDescription>
			</EmptyHeader>
			<div className="grid w-full max-w-sm grid-cols-2 gap-2">
				{API_PROVIDERS.map(({ name, url }) => (
					<Button key={name} asChild variant="outline" size="sm">
						<a href={url} target="_blank" rel="noopener noreferrer">
							{LABELS[name] ?? name}
							<ExternalLink className="opacity-60" />
						</a>
					</Button>
				))}
			</div>
			<p className="text-xs text-muted-foreground">
				Keys stay local, stored in your browser.
			</p>
		</Empty>
	);
}

export default NoProvidersView;
