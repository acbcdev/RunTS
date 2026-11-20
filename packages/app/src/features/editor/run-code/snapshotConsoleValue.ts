import type { ConsoleValue } from "./types";

/** JSON-safe values keep their types across the worker and persisted tabs. */
export function snapshotConsoleValue(
	value: unknown,
	ancestors = new WeakSet<object>(),
	depth = 0,
): ConsoleValue {
	if (value === null) return { type: "null", text: "null" };
	if (typeof value !== "object")
		return {
			type: typeof value,
			text:
				typeof value === "string"
					? JSON.stringify(value)
					: `${String(value)}${typeof value === "bigint" ? "n" : ""}`,
		};
	if (ancestors.has(value)) return { type: "special", text: "[Circular]" };
	if (depth > 5) return { type: "special", text: "…" };
	if (value instanceof Promise)
		return { type: "special", text: "Promise { <state unavailable> }" };
	if (value instanceof Date)
		return {
			type: "special",
			text: Number.isNaN(value.getTime())
				? "Invalid Date"
				: value.toISOString(),
		};
	if (value instanceof RegExp) return { type: "special", text: String(value) };
	if (value instanceof Error)
		return {
			type: "error",
			text: `${value.name}: ${value.message}`,
			children: [["stack", { type: "string", text: value.stack ?? "" }]],
		};
	ancestors.add(value);
	const snapshot = (item: unknown) =>
		snapshotConsoleValue(item, ancestors, depth + 1);
	let text = "Object";
	let children: [string, ConsoleValue][];
	if (value instanceof Map) {
		text = `Map(${value.size})`;
		children = [...value].slice(0, 200).map(([key, item], index) => [
			String(index),
			{
				type: "object",
				text: "Entry",
				children: [
					["key", snapshot(key)],
					["value", snapshot(item)],
				],
			},
		]);
	} else if (value instanceof Set) {
		text = `Set(${value.size})`;
		children = [...value]
			.slice(0, 200)
			.map((item, index) => [String(index), snapshot(item)]);
	} else {
		if (Array.isArray(value)) text = `Array(${value.length})`;
		const descriptors = Object.entries(
			Object.getOwnPropertyDescriptors(value),
		).filter(([, item]) => item.enumerable);
		children = descriptors
			.slice(0, 200)
			.map(([key, item]) => [
				key,
				"value" in item
					? snapshot(item.value)
					: { type: "special", text: "[Getter]" },
			]);
		if (descriptors.length > 200)
			children.push([
				"…",
				{
					type: "special",
					text: `${descriptors.length - 200} more properties`,
				},
			]);
	}
	ancestors.delete(value);
	return { type: "object", text, children, array: Array.isArray(value) };
}
