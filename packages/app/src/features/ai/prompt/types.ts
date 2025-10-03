export type PromptInputProps = {
	value: string;
	onValueChange: (value: string) => void;
	isLoading: boolean;
	onSubmit: () => void;
	stop: () => void;
};
