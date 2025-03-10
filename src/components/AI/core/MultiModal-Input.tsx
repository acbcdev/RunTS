import TextareaAutosize from "@/components/ui/TextareaAutosize";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAIConfigStore } from "@/store/aiConfig";
import { useTabsStore } from "@/store/tabs";
import type { providers } from "@/types/ai";
import { Eye, EyeOff, Send, StopCircle } from "lucide-react";
import type { FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
type MultiModalInputProps = {
	input: string;
	isLoading: boolean;
	handleSubmit: (event: FormEvent) => void;
	setInput: (value: string) => void;
	stop: () => void;
};
export default function MultiModalInput({
	input,
	isLoading,
	handleSubmit,
	setInput,
	stop,
}: MultiModalInputProps) {
	const {
		provider,
		getProviders,
		setProvider,
		selectedModel,
		setSelectedModel,
		contenxtFile,
		setContenxtFile,
	} = useAIConfigStore(
		useShallow((state) => ({
			provider: state.provider,
			getProviders: state.getProviders,
			setProvider: state.setProvider,
			selectedModel: state.selectedModel,
			setSelectedModel: state.setSelectedModel,
			contenxtFile: state.contenxtFile,
			setContenxtFile: state.setContenxtFile,
		})),
	);
	const currentTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full gap-2 mx-auto  bg-background rounded-lg overflow-hidden "
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
						type={isLoading ? "button" : "submit"}
						onClick={isLoading ? stop : handleSubmit}
						size="icon"
						className={`size-10 ${isLoading && "bg-accent"}`}
					>
						{isLoading ? <StopCircle /> : <Send />}
					</Button>
				</div>

				<div className="flex w-fit gap-1 ">
					<Select
						required
						defaultValue={`${provider}::${selectedModel}`}
						onValueChange={(value) => {
							const [name, model] = value.split("::");
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
										<SelectItem key={model} value={`${name}::${model}`}>
											{model}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
					<CurrentFileToggle
						contenxtFile={contenxtFile}
						setContenxtFile={setContenxtFile}
						name={currentTab?.name ?? ""}
					/>
				</div>
			</div>
		</form>
	);
}
type ContextToggleButtonProps = {
	contenxtFile: boolean;
	setContenxtFile: (value: boolean) => void;
	name: string;
};

function CurrentFileToggle({
	contenxtFile,
	setContenxtFile,
	name,
}: ContextToggleButtonProps) {
	return (
		<Button
			variant={"currentFile"}
			type="button"
			className={`${!contenxtFile && "border-dashed"} `}
			onClick={() => setContenxtFile(!contenxtFile)}
		>
			<span
				className={`${!contenxtFile && "line-through"} hidden md:inline-block`}
			>
				{name}
			</span>
			<span className="text-muted ">Current Tab</span>{" "}
			{contenxtFile ? <Eye /> : <EyeOff />}
		</Button>
	);
}
