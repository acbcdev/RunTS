import { Button } from "@/components/ui/button";
import { Send, StopCircle } from "lucide-react";
import remarkGfm from "remark-gfm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAIConfigStore } from "@/store/aiConfig";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";
import { SelectGroup } from "@radix-ui/react-select";
import TextareaAutosize from "../ui/TextareaAutosize";
import type { providers } from "@/types/ai";
import { useChat } from "@/hooks/useChat";
export function Chat() {
	const {
		provider,
		getProviders,
		setProvider,
		selectedModel,
		setSelectedModel,
	} = useAIConfigStore();
	const {
		input,
		messages,
		setInput,
		isLoading,
		streamingContent,
		handleSubmit,
	} = useChat();
	return (
		<aside className="relative flex flex-col w-full h-full max-w-2xl border-none rounded-none shadow-none bg-background">
			<ScrollArea className="flex-1 h-0">
				<section className="p-4 space-y-4 overflow-y-auto">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`rounded-lg p-4  ${
									message.role === "user"
										? "bg-border text-primary-foreground"
										: "bg-input"
								}`}
							>
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									className="prose break-all hyphens-auto dark:prose-invert "
								>
									{message.content}
								</ReactMarkdown>
							</div>
						</div>
					))}
					{streamingContent && (
						<div className="flex mb-4 gap-x-2">
							<ReactMarkdown className="prose break-all hyphens-auto dark:prose-invert ">
								{streamingContent}
							</ReactMarkdown>
							<div className="rounded-full size-5 bg-border " />
						</div>
					)}
				</section>
			</ScrollArea>

			<section className="left-0 right-0 flex flex-col gap-2 p-4 bg-background">
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
										setInput((prev) => `${prev}\n`);
									}
								}}
								className="flex-1 break-words border-none shadow-none resize-none caret-accent focus:outline-none focus-visible:ring-0 focus:ring-0"
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
									{getProviders().map((provider) => (
										<SelectGroup key={provider.name}>
											<SelectLabel className="capitalize">
												{provider.name}
											</SelectLabel>
											{provider.models.map((model) => (
												<SelectItem
													key={model}
													value={`${provider.name}::::${model}`}
												>
													{model}
												</SelectItem>
											))}
										</SelectGroup>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</section>
		</aside>
	);
}
