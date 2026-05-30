import { ExternalLink } from "lucide-react";
import { API_PROVIDERS } from "@/features/ai/lib/constants";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import { TabsContent } from "@/features/ui/tabs";
import { Textarea } from "@/features/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/features/ui/tooltip";

export function AI() {
	const apiKeys = useAIConfigStore((state) => state.apiKeys);
	const setApiKeys = useAIConfigStore((state) => state.setApiKeys);
	const customInstructions = useAIConfigStore(
		(state) => state.customInstructions,
	);
	const setCustomInstructions = useAIConfigStore(
		(state) => state.setCustomInstructions,
	);

	return (
		<TabsContent value="ai" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 translate="no" className="mb-3 text-lg font-medium ">
						Api Keys
					</h3>
					<div className="flex flex-wrap xl:gap-2 md:gap-5">
						{API_PROVIDERS.map(({ name, url }) => {
							const apiKey = name as keyof typeof apiKeys;
							return (
								<div key={name}>
									<div className="flex items-center justify-start mb-2 gap-x-2">
										<Label htmlFor={name} className="block text-sm capitalize">
											{name}
										</Label>
										<TooltipProvider delayDuration={0}>
											<Tooltip>
												<TooltipTrigger asChild>
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
										className={`${apiKeys[apiKey] && "border-accent"} `}
										onChange={(e) => {
											setApiKeys(e.target.value.trim(), name);
										}}
										value={apiKeys[apiKey]}
									/>
								</div>
							);
						})}
					</div>
				</section>
				<section>
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-lg font-medium">Custom Instructions</h3>
						<span className="text-xs text-muted-foreground">
							{customInstructions.length} characters
						</span>
					</div>
					<Textarea
						className="min-h-22"
						placeholder="e.g. Respond in Spanish. Be terse and avoid long explanations."
						value={customInstructions}
						onChange={(e) => setCustomInstructions(e.target.value)}
					/>
				</section>
			</div>
		</TabsContent>
	);
}
