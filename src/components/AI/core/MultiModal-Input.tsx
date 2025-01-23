import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectLabel,
	SelectGroup,
	SelectItem,
	SelectContent,
	SelectValue,
} from "@/components/ui/select";
import TextareaAutosize from "@/components/ui/TextareaAutosize";
import { useAIConfigStore } from "@/store/aiConfig";
import type { providers } from "@/types/ai";
import { Send, StopCircle } from "lucide-react";
import type { FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
type MultiModalInputProps = {
	input: string;
	isLoading: boolean;
	handleSubmit: (event: FormEvent) => void;
	setInput: (value: string) => void;
};
export default function MultiModalInput({
	input,
	isLoading,
	handleSubmit,
	setInput,
}: MultiModalInputProps) {
	const {
		provider,
		getProviders,
		setProvider,
		selectedModel,
		setSelectedModel,
	} = useAIConfigStore(
		useShallow((state) => ({
			provider: state.provider,
			getProviders: state.getProviders,
			setProvider: state.setProvider,
			selectedModel: state.selectedModel,
			setSelectedModel: state.setSelectedModel,
		})),
	);
	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full gap-2 mx-auto border rounded-lg bg-background border-border"
		>
			<div className="flex flex-col flex-1 gap-2 px-3 py-2">
				<div className="flex flex-1">
					<TextareaAutosize
						value={input}
						disabled={isLoading}
						onChangeValue={(e) => setInput(e)}
						placeholder="Message..."
						onKeyDown={(event) => {
							const key = event.key;
							if (key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								handleSubmit(event);
							}
							if (key === "Enter" && event.shiftKey) {
								event.preventDefault();
								setInput(`${input}\n`);
							}
						}}
						className="flex-1 break-words border-none shadow-none resize-none caret-accent focus:outline-hidden focus-visible:ring-0 focus:ring-0"
					/>
					<Button
						disabled={isLoading}
						type="submit"
						size="icon"
						variant={"ghost"}
						className="size-5"
					>
						{isLoading ? <StopCircle /> : <Send />}
					</Button>
				</div>

				<div className="flex w-fit ">
					<Select
						required
						defaultValue={`${provider}::::${selectedModel}`}
						onValueChange={(value) => {
							// alert(value);
							const [name, model] = value.split("::::");
							setSelectedModel(model);
							setProvider(name as providers);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select model" />
						</SelectTrigger>
						<SelectContent>
							{getProviders().map(({ name, Icon, models }) => (
								<SelectGroup key={name}>
									<SelectLabel className="flex capitalize gap-x-2">
										<Icon className="size-4" /> {name}
									</SelectLabel>
									{models.map((model) => (
										<SelectItem key={model} value={`${name}::::${model}`}>
											{model}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
					<span className="px-2 py-1 mx-2 border rounded-lg border-accent">
						beta
					</span>
				</div>
			</div>
		</form>
	);
}
