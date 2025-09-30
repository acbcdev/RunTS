import { ExternalLink } from "lucide-react";
import { useAIConfigStore } from "../../ai/store/aiConfig";
import { API_PROVIDERS } from "../../common/utils/index";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { TabsContent } from "../../ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../ui/tooltip";

export function AI() {
	const apiKeys = useAIConfigStore((state) => state.apiKeys);
	const setApiKeys = useAIConfigStore((state) => state.setApiKeys);

	return (
		<TabsContent value="ai" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 translate="no" className="mb-3 text-lg font-medium ">
						Api Keys
					</h3>
					<div className="flex flex-wrap xl:gap-2 md:gap-5">
						{API_PROVIDERS.map(({ name, url }) => (
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
									className={`${apiKeys[name] && "border-accent"} `}
									onChange={(e) => {
										setApiKeys(e.target.value.trim(), name);
									}}
									value={apiKeys[name]}
								/>
							</div>
						))}
					</div>
				</section>
			</div>
		</TabsContent>
	);
}
