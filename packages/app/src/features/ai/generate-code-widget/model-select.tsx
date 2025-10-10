import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { useAIConfigStore } from "../store";
import type { providers } from "../types";

export function ModelSelect() {
	const getProviders = useAIConfigStore((state) => state.getProviders);
	const value = useAIConfigStore((state) => state.selectedModel);
	const changeModel = useAIConfigStore((state) => state.changeModel);

	const activeModels = getProviders();

	return (
		<Select
			value={`${value.provider}/${value.id}`}
			onValueChange={(selectedValue) => {
				const [provider, modelId] = selectedValue.split("/");
				changeModel({
					id: modelId,
					provider: provider as providers,
					Icon: undefined, // We'll handle icons later if needed
				});
			}}
		>
			<SelectTrigger className="h-8 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-xs w-40">
				<SelectValue placeholder="Model" />
			</SelectTrigger>
			<SelectContent>
				{activeModels.map((model) => (
					<SelectItem key={model.id} value={`${model.provider}/${model.id}`}>
						{model.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
