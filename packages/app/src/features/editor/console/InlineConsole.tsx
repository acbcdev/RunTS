import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/features/common/utils/utils";
import { ConsoleEntry, ConsoleMethodIcon } from "./ConsoleEntry";
import type { ConsoleViewProps } from "./types";

export function InlineConsole({
	entries,
	onHover,
	pinned,
	lineNumbers,
}: ConsoleViewProps) {
	const [closed, setClosed] = useState(
		() =>
			new Set(
				entries.filter((entry) => entry.collapsed).map((entry) => entry.id),
			),
	);
	const hidden = new Set<number>();
	return (
		<div className="relative">
			{entries.map((entry) => {
				if (
					entry.group !== undefined &&
					(closed.has(entry.group) || hidden.has(entry.group))
				) {
					hidden.add(entry.id);
					return null;
				}
				const isGroup =
					entry.type === "group" || entry.type === "groupCollapsed";
				return (
					<section
						key={entry.id}
						data-source-line={entry.line}
						aria-label={`console.${entry.type}, line ${entry.line}`}
						className={cn(
							"group/entry relative flex items-start gap-3 border-l-2 border-transparent py-0 pr-4 hover:border-info/50 hover:bg-info/10 focus-within:bg-info/10",
							pinned === entry.line && "border-info/50 bg-info/10",
						)}
						style={{ paddingLeft: 2 + entry.depth * 18 }}
						onMouseEnter={() => onHover(entry.line)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(entry.line)}
						onBlur={() => onHover(null)}
					>
						<span className="flex shrink-0 items-start gap-2">
							{lineNumbers && (
								<span className="min-w-[3ch] text-right leading-[inherit] text-foreground/40 tabular-nums">
									{entry.line || "—"}
								</span>
							)}
							<ConsoleMethodIcon method={entry.type} />
						</span>
						<div className="min-w-0 flex-1">
							{isGroup ? (
								<div className="flex items-start gap-1">
									<button
										type="button"
										className="mt-1 shrink-0"
										aria-label={
											closed.has(entry.id) ? "Expand group" : "Collapse group"
										}
										aria-expanded={!closed.has(entry.id)}
										onClick={() =>
											setClosed((previous) => {
												const next = new Set(previous);
												if (next.has(entry.id)) next.delete(entry.id);
												else next.add(entry.id);
												return next;
											})
										}
									>
										{closed.has(entry.id) ? (
											<ChevronRight className="size-3.5" />
										) : (
											<ChevronDown className="size-3.5" />
										)}
									</button>
									<ConsoleEntry entry={entry} />
								</div>
							) : (
								<ConsoleEntry entry={entry} />
							)}
						</div>
					</section>
				);
			})}
		</div>
	);
}
