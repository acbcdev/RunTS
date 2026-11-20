import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Entry } from "./model";
import { MethodIcon, Output, SourceLink } from "./output";

export type VariantProps = {
	entries: Entry[];
	onHover: (line: number | null) => void;
	onPin: (line: number) => void;
	pinned: number | null;
};

export function Inline({ entries, onHover, onPin, pinned }: VariantProps) {
	const [closed, setClosed] = useState<Set<number>>(
		() => new Set(entries.filter((e) => e.collapsed).map((e) => e.id)),
	);
	const hidden = new Set<number>();
	return (
		<div className="inline-output">
			{entries.map((entry) => {
				if (
					entry.group !== undefined &&
					(closed.has(entry.group) || hidden.has(entry.group))
				) {
					hidden.add(entry.id);
					return null;
				}
				return (
					<section
						aria-label={`console.${entry.method}, línea ${entry.line}`}
						key={entry.id}
						className={`log-row level-${entry.method} ${pinned === entry.line ? "is-pinned" : ""}`}
						style={{ paddingLeft: 18 + entry.depth * 18 }}
						onMouseEnter={() => onHover(entry.line)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(entry.line)}
						onBlur={() => onHover(null)}
					>
						<span className="log-gutter">
							<MethodIcon method={entry.method} />
							<span>{entry.line || "—"}</span>
						</span>
						<div className="log-content">
							{entry.method === "group" ? (
								<button
									type="button"
									className="group-toggle"
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
										<ChevronRight size={14} />
									) : (
										<ChevronDown size={14} />
									)}
									<Output entry={entry} />
								</button>
							) : (
								<Output entry={entry} />
							)}
						</div>
						<SourceLink line={entry.line} onSelect={() => onPin(entry.line)} />
					</section>
				);
			})}
		</div>
	);
}
