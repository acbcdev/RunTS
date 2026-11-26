import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { useAIConfigStore, visibleModels } from "../store/aiConfig";

export function ModelSelect() {
	const providers = useAIConfigStore((state) => state.providers);
	const value = useAIConfigStore((state) => state.selectedModel);
	const changeModel = useAIConfigStore((state) => state.changeModel);

	return (
		<Select
			value={value.providerId ? `${value.providerId}/${value.id}` : undefined}
			onValueChange={(selected) => {
				// Model ids can contain "/" (OpenRouter), so split on the first one only.
				const slash = selected.indexOf("/");
				changeModel({
					providerId: selected.slice(0, slash),
					id: selected.slice(slash + 1),
				});
			}}
		>
			<SelectTrigger className="h-8 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-xs w-40">
				<SelectValue placeholder="Model" />
			</SelectTrigger>
			<SelectContent>
				{visibleModels(providers).map((m) => (
					<SelectItem
						key={`${m.providerId}/${m.id}`}
						value={`${m.providerId}/${m.id}`}
					>
						{m.id}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
