"use client";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { models } from "@/features/common/utils/index";
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
import { useAIConfigStore } from "../store/aiConfig";
import type { providers } from "../types";

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
					className="min-w-[150px] justify-between bg-transparent"
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
									{model?.Icon && <model.Icon className=" h-4 w-4" />}
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
