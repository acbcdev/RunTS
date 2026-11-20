import {
	ArrowDownUp,
	Braces,
	Bug,
	ChevronDown,
	ChevronRight,
	CircleAlert,
	CircleX,
	Clock3,
	Hash,
	Info,
	ListTree,
	Table2,
	TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import type { Entry, Value } from "./model";

export function MethodIcon({ method }: { method: string }) {
	const Icon = (
		{
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
		} as Record<string, typeof Info>
	)[method];
	return Icon ? (
		<Icon
			className={`method-icon method-${method}`}
			size={14}
			aria-label={`console.${method}`}
		/>
	) : (
		<span className="method-dot" />
	);
}

export function ValueTree({ value, name }: { value: Value; name?: string }) {
	const [open, setOpen] = useState(false);
	if (!value.children)
		return (
			<span className={`value value-${value.type}`}>
				{name && <span className="property">{name}: </span>}
				{value.text}
			</span>
		);
	return (
		<span className="tree">
			<button
				type="button"
				className="tree-toggle"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
			>
				{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
				{name && <span className="property">{name}:</span>}
				<span>{value.text}</span>
				{!open && (
					<span className="preview">{`{ ${value.children
						.slice(0, 3)
						.map(
							([key, item]) =>
								`${key}: ${item.children ? item.text : item.text}`,
						)
						.join(", ")}${value.children.length > 3 ? ", …" : ""} }`}</span>
				)}
			</button>
			{open && (
				<span className="tree-children">
					{value.children.map(([key, child]) => (
						<span className="tree-child" key={key}>
							<ValueTree value={child} name={key} />
						</span>
					))}
				</span>
			)}
		</span>
	);
}

export function DataTable({ entry }: { entry: Entry }) {
	const [sort, setSort] = useState<{ key: string; reverse: boolean } | null>(
		null,
	);
	const value = entry.values[0];
	if (!value?.children)
		return (
			<ValueTree value={value ?? { type: "undefined", text: "undefined" }} />
		);
	const rows = value.children.map(([index, row]) => ({
		index,
		cells: Object.fromEntries(row.children ?? [["Values", row]]),
	}));
	const columns = [
		...new Set(rows.flatMap((row) => Object.keys(row.cells))),
	].filter((key) => !entry.columns || entry.columns.includes(key));
	if (sort)
		rows.sort((a, b) => {
			const left =
				sort.key === "(index)" ? a.index : (a.cells[sort.key]?.text ?? "");
			const right =
				sort.key === "(index)" ? b.index : (b.cells[sort.key]?.text ?? "");
			return (
				left.localeCompare(right, undefined, { numeric: true }) *
				(sort.reverse ? -1 : 1)
			);
		});
	return (
		<div className="data-table-wrap">
			<table className="data-table">
				<thead>
					<tr>
						{["(index)", ...columns].map((key) => (
							<th key={key} scope="col">
								<button
									type="button"
									onClick={() =>
										setSort({
											key,
											reverse: sort?.key === key && !sort.reverse,
										})
									}
								>
									{key}
									<ArrowDownUp size={11} />
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.index}>
							<th scope="row">{row.index}</th>
							{columns.map((key) => (
								<td key={key}>
									{row.cells[key] && <ValueTree value={row.cells[key]} />}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="table-caption">
				{rows.length} filas <span>·</span> {columns.length} columnas
			</div>
		</div>
	);
}

export function Output({ entry }: { entry: Entry }) {
	return entry.method === "table" ? (
		<DataTable entry={entry} />
	) : (
		<div className="values">
			{entry.values.map((value, i) => (
				<ValueTree key={`${entry.id}-${i}`} value={value} />
			))}
		</div>
	);
}

export function SourceLink({
	line,
	onSelect,
}: {
	line: number;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			className="source-link"
			onClick={onSelect}
			title="Fijar línea de origen"
		>
			playground.js:{line || "?"}
		</button>
	);
}
