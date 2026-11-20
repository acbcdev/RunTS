import { useState } from "react";
import { cn } from "@/features/common/utils/utils";
import {
	ConsoleEntry,
	ConsoleMethodIcon,
	ConsoleSourceLink,
} from "./ConsoleEntry";
import type { ConsoleViewProps } from "./types";

export function InspectorConsole({
	entries,
	onHover,
	onPin,
	fileName,
	lineNumbers,
}: ConsoleViewProps) {
	const [selected, setSelected] = useState(
		entries.find((entry) => entry.type === "table")?.id ?? entries[0]?.id,
	);
	const entry = entries.find((item) => item.id === selected) ?? entries[0];
	return (
		<div className="grid min-h-full grid-cols-[minmax(120px,.7fr)_minmax(0,1.3fr)]">
			<div className="min-w-0 border-r py-3">
				<div className="px-3 pb-3 font-sans text-[.6em] tracking-widest text-foreground/50">
					EVENTS · {entries.length}
				</div>
				{entries.map((item) => (
					<button
						type="button"
						key={item.id}
						data-source-line={item.line}
						className={cn(
							"flex w-full items-start gap-2 border-l-2 border-transparent px-3 py-2 text-left hover:bg-foreground/3 focus-visible:outline-1 focus-visible:outline-accent",
							item.id === entry?.id && "border-info/50 bg-info/10",
						)}
						onClick={() => {
							setSelected(item.id);
							onPin(item.line);
						}}
						onMouseEnter={() => onHover(item.line)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(item.line)}
						onBlur={() => onHover(null)}
					>
						<ConsoleMethodIcon method={item.type} />
						<span className="flex min-w-0 flex-1 flex-col gap-1">
							<span className="truncate text-[.8em]">console.{item.type}</span>
							<span className="truncate text-[.7em] text-foreground/60">
								{item.values.map((value) => value.text).join(" ")}
							</span>
						</span>
						{lineNumbers && (
							<span className="text-[.65em] text-foreground/45">
								{item.line || "—"}
							</span>
						)}
					</button>
				))}
			</div>
			<section
				aria-label="Event details"
				className="sticky top-0 h-fit min-w-0"
				onMouseEnter={() => onHover(entry?.line ?? null)}
				onMouseLeave={() => onHover(null)}
				onFocus={() => onHover(entry?.line ?? null)}
				onBlur={() => onHover(null)}
			>
				{entry && (
					<>
						<div className="flex flex-wrap items-center gap-2 border-b p-3 text-[.8em]">
							<ConsoleMethodIcon method={entry.type} />
							<span>console.{entry.type}</span>
							<span className="ml-auto">
								<ConsoleSourceLink
									entry={entry}
									fileName={fileName}
									onSelect={() => onPin(entry.line)}
								/>
							</span>
						</div>
						<div className="p-3">
							<ConsoleEntry key={entry.id} entry={entry} />
						</div>
					</>
				)}
			</section>
		</div>
	);
}
