"use client";

import { Button } from "@/components/ui/button";
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useAIConfigStore } from "@/store/aiConfig";
import { useTabsStore } from "@/store/tabs";
import { ArrowUp, Eye, EyeOff, Square } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { ComboboxSelect } from "./ComboxSelector";

type PromptInputProps = {
	value: string;
	onValueChange: (value: string) => void;
	isLoading: boolean;
	onSubmit: () => void;
	stop: () => void;
};
export function PromptInputWithActions({
	value,
	onValueChange,
	isLoading,
	onSubmit,
	stop,
}: PromptInputProps) {
	const contextFile = useAIConfigStore(
		useShallow((state) => state.contextFile),
	);
	const setContextFile = useAIConfigStore(
		useShallow((state) => state.setContextFile),
	);
	const tab = useTabsStore((state) => state.getCurrentTab());
	const handleSubmit = () => {
		if (value.trim()) {
			onSubmit();
		}
	};

	return (
		<PromptInput
			value={value}
			onValueChange={onValueChange}
			isLoading={isLoading}
			onSubmit={handleSubmit}
			className="w-full max-w-(--breakpoint-md)"
		>
			<PromptInputTextarea placeholder="Ask me anything..." />

			<PromptInputActions className="flex items-center justify-between gap-2 pt-2">
				<div className="flex items-center gap-2">
					<ComboboxSelect />
					<Button
						variant={"currentFile"}
						type="button"
						className={`${!contextFile && "border-dashed"} `}
						onClick={() => setContextFile(!contextFile)}
					>
						<span
							className={`${!contextFile && "line-through"} hidden md:inline-block`}
						>
							{tab?.name}
						</span>
						{/* <span className="text-muted ">Current Tab</span>{" "} */}
						{contextFile ? <Eye /> : <EyeOff />}
					</Button>
				</div>

				<PromptInputAction
					tooltip={isLoading ? "Stop generation" : "Send message"}
				>
					<Button
						variant="default"
						size="icon"
						className="h-8 w-8 rounded-full"
						onClick={isLoading ? handleSubmit : stop}
					>
						{isLoading ? (
							<Square className="size-5 fill-current" />
						) : (
							<ArrowUp className="size-5" />
						)}
					</Button>
				</PromptInputAction>
			</PromptInputActions>
		</PromptInput>
	);
}
