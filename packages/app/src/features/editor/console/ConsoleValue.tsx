import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/features/common/utils/utils";
import type { ConsoleValue as Value } from "../run-code/types";

const colors: Record<string, string> = {
	string: "text-[var(--console-string)]",
	number: "text-[var(--console-number)]",
	bigint: "text-[var(--console-number)]",
	boolean: "text-[var(--console-keyword)]",
	undefined: "text-foreground/60",
	null: "text-foreground/60",
	special: "italic text-success",
	error: "text-destructive",
};

const MAX_PREVIEW = 5;

function preview(value: Value, depth = 0): string {
	if (!value.children) return value.text;
	const [open, close] = value.array ? ["[", "]"] : ["{", "}"];
	const prefix = value.array || value.text === "Object" ? "" : `${value.text} `;
	if (!value.children.length) return `${prefix}${open}${close}`;
	if (depth > 0) return `${prefix}${open}…${close}`;
	const items = value.children.slice(0, MAX_PREVIEW).map(([key, item]) => {
		const text = preview(item, depth + 1);
		return value.array ? text : `${key}: ${text}`;
	});
	if (value.children.length > MAX_PREVIEW) items.push("…");
	const body = value.array ? items.join(", ") : ` ${items.join(", ")} `;
	return `${prefix}${open}${body}${close}`;
}

export function ConsoleValue({ value, name }: { value: Value; name?: string }) {
	const [open, setOpen] = useState(false);
	if (!value.children)
		return (
			<span
				className={cn("whitespace-pre-wrap break-words", colors[value.type])}
			>
				{name !== undefined && (
					<span className="text-[var(--console-property)]">{name}: </span>
				)}
				{value.text}
			</span>
		);
	return (
		<span className="inline-flex max-w-full flex-col align-top">
			<button
				type="button"
				className="inline-flex max-w-full items-baseline gap-1 text-left hover:text-foreground focus-visible:outline-1 focus-visible:outline-accent"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
			>
				{open ? (
					<ChevronDown className="size-3 shrink-0 self-center text-foreground/60" />
				) : (
					<ChevronRight className="size-3 shrink-0 self-center text-foreground/60" />
				)}
				{name !== undefined && (
					<span className="text-[var(--console-property)]">{name}:</span>
				)}
				<span className="truncate">
					{open
						? `${value.array || value.text === "Object" ? "" : `${value.text} `}${value.array ? "[" : "{"}`
						: preview(value)}
				</span>
			</button>
			{open && (
				<span className="mt-1 ml-1 flex flex-col gap-1 border-l pl-4">
					{value.children.map(([key, child]) => (
						<span key={key}>
							<ConsoleValue
								value={child}
								name={value.array ? undefined : key}
							/>
						</span>
					))}
					<span className="-ml-4">{value.array ? "]" : "}"}</span>
				</span>
			)}
		</span>
	);
}
