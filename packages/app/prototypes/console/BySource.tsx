import { ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { useState } from "react";
import type { VariantProps } from "./Inline";
import { MethodIcon, Output } from "./output";

export function BySource({ entries, onHover, onPin, pinned }: VariantProps) {
	const [closed, setClosed] = useState(new Set<number>());
	const lines = [...new Set(entries.map((entry) => entry.line))];
	return (
		<div className="source-output">
			<div className="source-intro">
				<CornerDownRight size={15} />
				<span>Una línea, todos sus resultados.</span>
				<span>{lines.length} orígenes</span>
			</div>
			{lines.map((line) => {
				const items = entries.filter((entry) => entry.line === line);
				const open = !closed.has(line);
				return (
					<section
						aria-label={`Resultados de la línea ${line}`}
						key={line}
						className={`source-block ${pinned === line ? "is-pinned" : ""}`}
						onMouseEnter={() => onHover(line)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(line)}
						onBlur={() => onHover(null)}
					>
						<div className="source-block-heading">
							<button
								type="button"
								className="source-disclosure"
								aria-expanded={open}
								onClick={() =>
									setClosed((previous) => {
										const next = new Set(previous);
										if (next.has(line)) next.delete(line);
										else next.add(line);
										return next;
									})
								}
							>
								{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
								<MethodIcon method={items[0].method} />
								console.{items[0].method}
								<span className="result-count">
									{items.length}{" "}
									{items.length === 1 ? "resultado" : "resultados"}
								</span>
							</button>
							<button
								type="button"
								className="source-link"
								onClick={() => onPin(line)}
							>
								Línea {line}
							</button>
						</div>
						{open && (
							<div className="source-block-results">
								{items.map((item) => (
									<div
										className={`source-result level-${item.method}`}
										key={item.id}
									>
										<Output entry={item} />
									</div>
								))}
							</div>
						)}
					</section>
				);
			})}
		</div>
	);
}
