import { Key, Settings, Zap } from "lucide-react";
import { API_PROVIDERS } from "../lib/constants";
import { Button } from "@/features/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/features/ui/card";

export function NoProvidersView() {
	const getProviderLabel = (name: string) => {
		switch (name.toLowerCase()) {
			case "google":
				return "Get Google Gemini API";
			case "anthropic":
				return "Get Claude API";
			case "openai":
				return "Get ChatGPT API";
			case "mistral":
				return "Get Mistral API";
			default:
				return `Get ${name.charAt(0).toUpperCase() + name.slice(1)} API`;
		}
	};
	return (
		<section className="flex flex-col items-center justify-center h-full p-8 space-y-8 border-r">
			{/* Hero Section */}
			<Key size={40} strokeWidth={1.5} />
			<header className="text-center space-y-4">
				<div className="space-y-2">
					<h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						Connect Your AI
					</h1>
					<p className="text-muted-foreground max-w-md mx-auto">
						Choose an AI provider to unlock intelligent code assistance and chat
						features
					</p>
				</div>
			</header>

			{/* Action Cards */}
			<div className="w-full max-w-md space-y-4">
				{/* Settings Card */}
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<Settings size={18} className="text-primary" />
							<CardTitle className="text-base">Configure API Keys</CardTitle>
						</div>
						<CardDescription className="text-sm">
							Add your API keys in Settings {">"} AI tab
						</CardDescription>
					</CardHeader>
				</Card>

				{/* Providers Section */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Zap size={16} />
						<span className="font-medium">Quick Start</span>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{API_PROVIDERS.map((provider) => {
							return (
								<Button
									key={provider.name}
									asChild
									variant="outline"
									size="sm"
									className="h-11 group hover:bg-primary/5 hover:border-primary/30 transition-all"
								>
									<a
										href={provider.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center w-full font-medium"
									>
										{getProviderLabel(provider.name)}
									</a>
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

export default NoProvidersView;
