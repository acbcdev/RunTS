"use client";

import { type ChangeEvent, type ComponentProps, useId, useRef } from "react";
import { cn } from "../lib/cn";
import { Textarea } from "./textarea";

interface TextareaAutosizeProps extends ComponentProps<"textarea"> {
	onChangeValue: (e: string) => void;
}
export default function TextareaAutosize({
	className,
	onChangeValue,
	...props
}: TextareaAutosizeProps) {
	const id = useId();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const defaultRows = 1;
	const maxRows = 6; // You can set a max number of rows

	const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChangeValue(e.target.value);
		const textarea = e.target;
		textarea.style.height = "auto";
		const style = window.getComputedStyle(textarea);
		const borderHeight = Number.parseInt(style.borderBottomWidth, 10);
		const paddingHeight =
			Number.parseInt(style.paddingTop, 10) +
			Number.parseInt(style.paddingBottom, 10);

		const lineHeight = Number.parseInt(style.lineHeight, 10);
		const maxHeight = maxRows
			? lineHeight * maxRows + borderHeight + paddingHeight
			: Number.POSITIVE_INFINITY;

		const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

		textarea.style.height = `${newHeight}px`;
	};

	return (
		<Textarea
			id={id}
			ref={textareaRef}
			onChange={handleInput}
			rows={defaultRows}
			className={cn("min-h-[none] resize-none bg-trasparent", className)}
			{...props}
		/>
	);
}
