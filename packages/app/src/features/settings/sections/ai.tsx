import { ExternalLink } from "lucide-react";
import { useId, useState } from "react";
import { API_PROVIDERS } from "@/features/ai/lib/constants";
import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/features/ui/input-group";
import { Label } from "@/features/ui/label";
import { TabsContent } from "@/features/ui/tabs";
import { Textarea } from "@/features/ui/textarea";
import { SettingsSection } from "../components/SettingsSection";

export function AI() {
	const apiKeys = useAIConfigStore((state) => state.apiKeys);
	const setApiKeys = useAIConfigStore((state) => state.setApiKeys);
	const customInstructions = useAIConfigStore(
		(state) => state.customInstructions,
	);
	const setCustomInstructions = useAIConfigStore(
		(state) => state.setCustomInstructions,
	);
	const id = useId();
	const [revealed, setRevealed] = useState<Record<string, boolean>>({});
	return (
		<TabsContent value="ai" className="m-0 flex flex-col gap-7">
			<SettingsSection title="API keys">
				{API_PROVIDERS.map(({ name, url }) => {
					const apiKey = name as keyof typeof apiKeys;
					return (
						<div key={name} className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Label htmlFor={`${id}-${name}`} className="text-xs capitalize">
									{name}
								</Label>
								<a
									href={url}
									target="_blank"
									rel="noreferrer"
									aria-label={`Get ${name} API key`}
									className="text-foreground/65 hover:text-foreground"
								>
									<ExternalLink className="size-3" />
								</a>
								<span className="ml-auto text-[10px] text-foreground/65">
									{apiKeys[apiKey] ? "Configured" : "Not configured"}
								</span>
							</div>
							<InputGroup>
								<InputGroupInput
									type={revealed[name] ? "text" : "password"}
									id={`${id}-${name}`}
									autoComplete="off"
									spellCheck={false}
									onChange={(event) =>
										setApiKeys(event.target.value.trim(), name)
									}
									value={apiKeys[apiKey]}
									placeholder={`Enter ${name} API key`}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										aria-label={`${revealed[name] ? "Hide" : "Show"} ${name} key`}
										aria-pressed={!!revealed[name]}
										onClick={() =>
											setRevealed((state) => ({
												...state,
												[name]: !state[name],
											}))
										}
									>
										{revealed[name] ? "Hide" : "Show"}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
						</div>
					);
				})}
			</SettingsSection>
			<SettingsSection title="Custom instructions">
				<div className="flex items-center justify-between gap-3">
					<Label htmlFor={`${id}-instructions`} className="text-xs">
						How should the assistant respond?
					</Label>
					<span className="text-[10px] text-foreground/65">
						{customInstructions.length} characters
					</span>
				</div>
				<Textarea
					id={`${id}-instructions`}
					className="min-h-32"
					placeholder="e.g. Respond in Spanish. Keep explanations concise."
					value={customInstructions}
					onChange={(event) => setCustomInstructions(event.target.value)}
				/>
			</SettingsSection>
		</TabsContent>
	);
}
