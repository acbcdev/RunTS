import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { VariantProps } from "./Inline";
import { MethodIcon, Output } from "./output";

export function Inspector({ entries, onHover, onPin }: VariantProps) {
	const [selected, setSelected] = useState(
		entries.find((e) => e.method === "table")?.id ?? entries[0]?.id,
	);
	const entry = entries.find((e) => e.id === selected) ?? entries[0];
	return (
		<div className="inspector-layout">
			<div className="event-list">
				<div className="section-label">
					EVENTOS <span>{entries.length}</span>
				</div>
				{entries.map((item) => (
					<button
						type="button"
						className={`event-item ${item.id === entry?.id ? "selected" : ""}`}
						key={item.id}
						onClick={() => {
							setSelected(item.id);
							onPin(item.line);
						}}
						onMouseEnter={() => onHover(item.line)}
						onMouseLeave={() => onHover(null)}
						onFocus={() => onHover(item.line)}
						onBlur={() => onHover(null)}
					>
						<MethodIcon method={item.method} />
						<span className="event-summary">
							<span className="event-method">console.{item.method}</span>
							<span>{item.values.map((v) => v.text).join(" ")}</span>
						</span>
						<span className="event-line">{item.line}</span>
					</button>
				))}
			</div>
			<section
				aria-label="Detalle del evento"
				className="inspector-detail"
				onMouseEnter={() => onHover(entry?.line ?? null)}
				onMouseLeave={() => onHover(null)}
				onFocus={() => onHover(entry?.line ?? null)}
				onBlur={() => onHover(null)}
			>
				{entry && (
					<>
						<div className="detail-heading">
							<MethodIcon method={entry.method} />
							<span>console.{entry.method}</span>
							<button
								type="button"
								className="source-link"
								onClick={() => onPin(entry.line)}
							>
								Línea {entry.line}
								<ArrowUpRight size={13} />
							</button>
						</div>
						<div className="detail-content">
							<Output entry={entry} />
						</div>
						<div className="detail-note">
							Selecciona un evento para inspeccionar sus datos.
						</div>
					</>
				)}
			</section>
		</div>
	);
}
