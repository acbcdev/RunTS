"use client";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { models } from "@/consts";
import { useAIConfigStore } from "@/store/aiConfig";
import type { providers } from "@/types/ai";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function ComboboxSelect() {
	const [open, setOpen] = useState(false);
	const getProviders = useAIConfigStore(
		useShallow((state) => state.getProviders),
	);

	const value = useAIConfigStore(useShallow((state) => state.selectedModel));
	const changeModel = useAIConfigStore(
		useShallow((state) => state.changeModel),
	);

	const currentModel = models.find((model) => model.id === value.id);

	const activeModels = getProviders();
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="min-w-[150px] justify-between "
				>
					{currentModel?.Icon && <currentModel.Icon className=" h-4 w-4" />}
					{value.id ? currentModel?.name : "Select a model..."}
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
						<CommandGroup>
							{activeModels.map((model) => (
								<CommandItem
									key={model.id}
									value={model.id}
									onSelect={(currentValue) => {
										changeModel({
											id: currentValue,
											provider: model.provider as providers,
											Icon: model.Icon,
										});
										setOpen(false);
									}}
								>
									{model.name}
									{value.id === model.id && <Check className="mr-2 h-4 w-4" />}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					{/* <Separator />
          <div className="p-1.5 pb-1">
            <Button variant={"ghost"} size={"icon"}>
              <ListFilter />
            </Button>
          </div> */}
				</Command>
			</PopoverContent>
		</Popover>
	);
}
