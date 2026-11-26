import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/features/ui/button";
import {
	ADD_PROVIDER_OPTIONS,
	PRESETS,
	type ProviderConfig,
} from "../lib/constants";
import { useAIConfigStore } from "../store/aiConfig";
import { newProvider, ProviderForm } from "./ProviderForm";

export function Providers() {
	const providers = useAIConfigStore((state) => state.providers);
	const selected = useAIConfigStore((state) => state.selectedModel);
	const saveProvider = useAIConfigStore((state) => state.saveProvider);
	const removeProvider = useAIConfigStore((state) => state.removeProvider);
	const changeModel = useAIConfigStore((state) => state.changeModel);
	const [editing, setEditing] = useState<ProviderConfig | null>(null);
	const modelCount = providers.reduce((n, p) => n + p.models.length, 0);

	return (
		<div className="flex flex-col gap-6">
			<p className="text-xs text-muted-foreground">
				{providers.length} configured · {modelCount} visible models. Keys live
				only in this browser and go straight to each provider.
			</p>

			{editing ? (
				<ProviderForm
					key={editing.id}
					initial={editing}
					onCancel={() => setEditing(null)}
					onSave={(provider) => {
						saveProvider(provider);
						setEditing(null);
					}}
				/>
			) : (
				<>
					{providers.length > 0 && (
						<ul className="flex flex-col">
							{providers.map((provider) => {
								const Icon = PRESETS[provider.preset].icon;
								return (
									<li key={provider.id} className="flex flex-col border-b pb-2">
										<div className="flex items-center gap-3 py-3">
											<Icon className="size-5 shrink-0" />
											<div className="min-w-0 flex-1">
												<p className="text-sm font-medium">{provider.name}</p>
												<p className="truncate font-mono text-xs text-muted-foreground">
													{provider.baseURL.replace(/^https?:\/\//, "")}
												</p>
											</div>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setEditing(provider)}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeProvider(provider.id)}
											>
												Remove
											</Button>
										</div>
										{provider.models.map((model) => {
											const inUse =
												selected.providerId === provider.id &&
												selected.id === model;
											return (
												<button
													key={model}
													type="button"
													disabled={inUse}
													onClick={() =>
														changeModel({ providerId: provider.id, id: model })
													}
													className="group flex items-center rounded-md px-8 py-1.5 text-left font-mono text-xs hover:bg-foreground/3 disabled:hover:bg-transparent"
												>
													<span className="flex-1 truncate">{model}</span>
													{inUse ? (
														<span className="font-sans text-green-500">
															in use
														</span>
													) : (
														<span className="font-sans text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
															use
														</span>
													)}
												</button>
											);
										})}
									</li>
								);
							})}
						</ul>
					)}

					<div className="flex flex-col">
						<h4 className="border-b pb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
							Add provider
						</h4>
						{ADD_PROVIDER_OPTIONS.map(({ preset, description }) => {
							const { icon: Icon, name } = PRESETS[preset];
							return (
								<button
									key={preset}
									type="button"
									onClick={() => setEditing(newProvider(preset))}
									className="flex items-center gap-3 border-b px-2 py-3 text-left hover:bg-foreground/3"
								>
									<Icon className="size-5 shrink-0" />
									<span className="min-w-0 flex-1">
										<span className="block text-sm font-medium">{name}</span>
										<span className="block text-xs text-muted-foreground">
											{description}
										</span>
									</span>
									<Plus className="size-4 text-muted-foreground" />
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
