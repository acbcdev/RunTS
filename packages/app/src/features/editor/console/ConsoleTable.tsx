import { ArrowDownUp } from "lucide-react";
import { useState } from "react";
import type { ConsoleOutput } from "../run-code/types";
import { ConsoleValue } from "./ConsoleValue";

export function ConsoleTable({ entry }: { entry: ConsoleOutput }) {
	const [sort, setSort] = useState<{ key: string; reverse: boolean } | null>(
		null,
	);
	const value = entry.values[0];
	if (!value?.children)
		return (
			<ConsoleValue value={value ?? { type: "undefined", text: "undefined" }} />
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
		<div className="my-1 max-w-full overflow-x-auto rounded-md border text-[.85em]">
			<table className="w-full border-collapse text-left whitespace-nowrap">
				<thead className="bg-header">
					<tr>
						{["(index)", ...columns].map((key) => (
							<th
								key={key}
								scope="col"
								aria-sort={
									sort?.key === key
										? sort.reverse
											? "descending"
											: "ascending"
										: "none"
								}
								className="border-r border-b px-3 py-1.5 font-normal last:border-r-0"
							>
								<button
									type="button"
									className="flex w-full items-center justify-between gap-4 focus-visible:outline-1 focus-visible:outline-accent"
									onClick={() =>
										setSort({
											key,
											reverse: sort?.key === key && !sort.reverse,
										})
									}
								>
									{key}
									<ArrowDownUp className="size-3 text-foreground/50" />
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.index} className="hover:bg-foreground/3">
							<th
								scope="row"
								className="border-r border-b px-3 py-1.5 font-normal text-foreground/50"
							>
								{row.index}
							</th>
							{columns.map((key) => (
								<td
									key={key}
									className="border-r border-b px-3 py-1.5 last:border-r-0"
								>
									{row.cells[key] && <ConsoleValue value={row.cells[key]} />}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className="px-3 py-1 text-[.85em] text-foreground/55">
				{rows.length} rows · {columns.length} columns
			</div>
		</div>
	);
}
