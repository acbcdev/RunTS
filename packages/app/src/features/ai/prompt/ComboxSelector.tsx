"use client";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/features/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/features/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/ui/popover";
import { PRESETS } from "../lib/constants";
import { useAIConfigStore, visibleModels } from "../store/aiConfig";

export function ComboboxSelect() {
	const [open, setOpen] = useState(false);
	const providers = useAIConfigStore((state) => state.providers);
	const value = useAIConfigStore((state) => state.selectedModel);
	const changeModel = useAIConfigStore((state) => state.changeModel);
	const providerList = useMemo(
		() =>
			providers
				.filter((p) => p.models.length > 0)
				.map((p) => ({ ...p, Icon: PRESETS[p.preset].icon })),
		[providers],
	);
	const current = visibleModels(providers).find(
		(m) => m.providerId === value.providerId && m.id === value.id,
	);
	const CurrentIcon = current && PRESETS[current.provider.preset].icon;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="min-w-[150px] justify-between bg-transparent"
				>
					{CurrentIcon && <CurrentIcon className="h-4 w-4" />}
					<span className="truncate max-w-48">
						{current?.id ?? "Select a model..."}
					</span>
					{open ? (
						<ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					) : (
						<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full md:w-[300px] ml-2 p-0">
				<Command>
					<CommandInput placeholder="Search models..." />
					<CommandList className="scroll">
						<CommandEmpty>No model found.</CommandEmpty>
						{providerList.map(({ id: providerId, name, models, Icon }) => (
							<CommandGroup key={providerId} heading={name}>
								{models.map((id) => (
									<CommandItem
										key={id}
										value={`${providerId}/${id}`}
										keywords={[id, name]}
										onSelect={() => {
											changeModel({ providerId, id });
											setOpen(false);
										}}
									>
										<Icon className="h-4 w-4" />
										<span className="truncate">{id}</span>
										{value.providerId === providerId && value.id === id && (
											<Check className="ml-auto h-4 w-4" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
