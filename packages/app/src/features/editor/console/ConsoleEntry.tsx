import type { LucideIcon } from "lucide-react";
import {
	Braces,
	Bug,
	CircleAlert,
	CircleX,
	Clock3,
	Hash,
	Info,
	ListTree,
	Table2,
	TriangleAlert,
} from "lucide-react";
import { cn } from "@/features/common/utils/utils";
import type { ConsoleMethod, ConsoleOutput } from "../run-code/types";
import { ConsoleTable } from "./ConsoleTable";
import { ConsoleValue } from "./ConsoleValue";

const icons: Partial<Record<ConsoleMethod, LucideIcon>> = {
	info: Info,
	warn: TriangleAlert,
	error: CircleX,
	assert: CircleAlert,
	debug: Bug,
	table: Table2,
	dir: Braces,
	dirxml: Braces,
	count: Hash,
	timeLog: Clock3,
	timeEnd: Clock3,
	trace: ListTree,
};
const iconColors: Partial<Record<ConsoleMethod, string>> = {
	info: "text-info",
	warn: "text-[var(--console-warning)]",
	error: "text-destructive",
	assert: "text-destructive",
	table: "text-success",
	timeLog: "text-accent",
	timeEnd: "text-accent",
};

export function ConsoleMethodIcon({ method }: { method: ConsoleMethod }) {
	const Icon = icons[method];
	// 1lh box = same height as a text line, so the icon centers on the line number
	return (
		<span className="flex h-[1lh] shrink-0 items-center">
			{Icon ? (
				<Icon
					aria-label={`console.${method}`}
					className={cn("size-3.5", iconColors[method] ?? "text-foreground/55")}
				/>
			) : (
				<span className="size-3.5" />
			)}
		</span>
	);
}

export function ConsoleEntry({ entry }: { entry: ConsoleOutput }) {
	return entry.type === "table" ? (
		<ConsoleTable entry={entry} />
	) : (
		<span className="flex flex-wrap items-start gap-x-2 gap-y-0">
			{entry.values.map((value, index) =>
				index > 0 && value.children ? (
					<span key={`${entry.id}-${index}`} className="basis-full">
						<ConsoleValue value={value} />
					</span>
				) : (
					<ConsoleValue key={`${entry.id}-${index}`} value={value} />
				),
			)}
		</span>
	);
}

export function ConsoleSourceLink({
	entry,
	fileName,
	onSelect,
}: {
	entry: Pick<ConsoleOutput, "line" | "column">;
	fileName: string;
	onSelect: () => void;
}) {
	return entry.line > 0 ? (
		<button
			type="button"
			className="shrink-0 text-[.7em] leading-normal text-foreground/55 hover:text-info hover:underline focus-visible:outline-1 focus-visible:outline-accent"
			onClick={onSelect}
			title="Pin source line"
		>
			{fileName}:{entry.line}
		</button>
	) : null;
}
