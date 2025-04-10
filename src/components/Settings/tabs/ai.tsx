import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { providersList } from "@/consts";
import { useAIConfigStore } from "@/store/aiConfig";
import type { providers as TProvider } from "@/types/ai";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
type Provider = { name: TProvider; url: string };
const providers: Provider[] = [
	{ name: "openai", url: "https://platform.openai.com/api-keys" },
	{ name: "google", url: "https://aistudio.google.com/apikey" },
	{ name: "anthropic", url: "https://console.anthropic.com/settings/keys" },
	{
		name: "mistral",
		url: "https://console.mistral.ai/api-keys",
	},
];

export function AI({ tabs = true }) {
	const apiKeys = useAIConfigStore((state) => state.apiKeys);
	const setApiKeys = useAIConfigStore((state) => state.setApiKeys);
	const setProvider = useAIConfigStore((state) => state.setProvider);
	const setSelectedModel = useAIConfigStore((state) => state.setSelectedModel);

	const Comp = tabs ? TabsContent : "div";
	return (
		<Comp value="ai (beta)" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 translate="no" className="mb-3 text-lg font-medium ">
						Api Keys
					</h3>
					<div className="flex flex-wrap xl:gap-2 md:gap-5">
						{providers.map(({ name, url }) => (
							<div key={name}>
								<div className="flex items-center justify-start mb-2 gap-x-2">
									<Label htmlFor={name} className="block text-sm capitalize">
										{name}
									</Label>
									<TooltipProvider delayDuration={0}>
										<Tooltip>
											<TooltipTrigger>
												<a
													href={url}
													target="_blank"
													rel="noreferrer"
													className="hover:text-accent"
												>
													<ExternalLink className="size-4" />
												</a>
											</TooltipTrigger>
											<TooltipContent>Get your api key here</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<Input
									type={"password"}
									id={name}
									className={`${apiKeys[name] && "border-accent"} `}
									onChange={(e) => {
										setApiKeys(e.target.value.trim(), name);
										setProvider(name);
										setSelectedModel(
											providersList.find((p) => p.name === name)?.models[0] ||
												"",
										);
									}}
									value={apiKeys[name]}
								/>
							</div>
						))}
					</div>
				</section>
			</div>
		</Comp>
	);
}
