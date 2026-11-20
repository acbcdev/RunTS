import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/features/common/utils/utils";
import type { ConsoleOutput } from "../run-code/types";
import {
	ConsoleEntry,
	ConsoleMethodIcon,
	ConsoleSourceLink,
} from "./ConsoleEntry";
import type { ConsoleViewProps } from "./types";

export function SourceConsole({
	entries,
	onHover,
	onPin,
	pinned,
	fileName,
}: ConsoleViewProps) {
	const [closed, setClosed] = useState(new Set<number>());
	const sources = new Map<number, ConsoleOutput[]>();
	for (const entry of entries) {
		const items = sources.get(entry.line);
		if (items) items.push(entry);
		else sources.set(entry.line, [entry]);
	}
	return (
		<div className="flex flex-col gap-3 p-4">
			{[...sources].map(([line, items]) => (
				<section
					key={line}
					data-source-line={line}
					aria-label={`Results from line ${line}`}
					className={cn(
						"min-w-0 overflow-hidden rounded-md border hover:border-info/50",
						pinned === line && "border-info/50",
					)}
					onMouseEnter={() => onHover(line)}
					onMouseLeave={() => onHover(null)}
					onFocus={() => onHover(line)}
					onBlur={() => onHover(null)}
				>
					<div className="flex flex-wrap items-center justify-between gap-2 bg-header px-3 py-2">
						<button
							type="button"
							className="flex items-center gap-2 text-[.8em]"
							aria-expanded={!closed.has(line)}
							onClick={() =>
								setClosed((previous) => {
									const next = new Set(previous);
									if (next.has(line)) next.delete(line);
									else next.add(line);
									return next;
								})
							}
						>
							{closed.has(line) ? (
								<ChevronRight className="size-3" />
							) : (
								<ChevronDown className="size-3" />
							)}
							<ConsoleMethodIcon method={items[0].type} />
							{items.every((item) => item.type === items[0].type)
								? `console.${items[0].type}`
								: "Console"}
							<span className="text-[.8em] text-foreground/55">
								{items.length} {items.length === 1 ? "result" : "results"}
							</span>
						</button>
						<ConsoleSourceLink
							entry={items[0]}
							fileName={fileName}
							onSelect={() => onPin(line)}
						/>
					</div>
					{!closed.has(line) && (
						<div className="flex flex-col gap-2 border-t p-3">
							{items.map((item) => (
								<ConsoleEntry key={item.id} entry={item} />
							))}
						</div>
					)}
				</section>
			))}
		</div>
	);
}
