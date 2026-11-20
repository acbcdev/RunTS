import { parse } from "acorn";
import { simple } from "acorn-walk";
import type { Entry, Value } from "./model";

function snapshot(value: unknown, seen = new WeakSet<object>()): Value {
	if (value === null) return { type: "null", text: "null" };
	if (typeof value !== "object") {
		return {
			type: typeof value,
			text:
				typeof value === "string"
					? JSON.stringify(value)
					: `${String(value)}${typeof value === "bigint" ? "n" : ""}`,
		};
	}
	if (seen.has(value)) return { type: "special", text: "[Circular]" };
	if (value instanceof Promise)
		return { type: "special", text: "Promise { <state unavailable> }" };
	if (value instanceof Date)
		return {
			type: "special",
			text:
				String(value) === "Invalid Date" ? "Invalid Date" : value.toISOString(),
		};
	if (value instanceof RegExp) return { type: "special", text: String(value) };
	if (value instanceof Error)
		return {
			type: "error",
			text: `${value.name}: ${value.message}`,
			children: [["stack", snapshot(value.stack)]],
		};
	seen.add(value);
	const items =
		value instanceof Map
			? [...value.entries()].map(([key, item]) => [String(key), item])
			: value instanceof Set
				? [...value].map((item, i) => [String(i), item])
				: Object.entries(value);
	const children = items.map(([key, item]): [string, Value] => [
		String(key),
		snapshot(item, seen),
	]);
	seen.delete(value);
	return {
		type: "object",
		text: Array.isArray(value)
			? `Array(${value.length})`
			: value instanceof Map
				? `Map(${value.size})`
				: value instanceof Set
					? `Set(${value.size})`
					: "Object",
		children,
	};
}

self.onmessage = async ({ data: code }: MessageEvent<string>) => {
	let entries: Entry[] = [];
	let id = 0;
	let sourceLine = 0;
	const groups: number[] = [];
	const timers = new Map<string, number>();
	const counts = new Map<string, number>();
	const emit = (method: string, args: unknown[], columns?: string[]) => {
		if (entries.length >= 300) return;
		const entry: Entry = {
			id: id++,
			method,
			line: sourceLine,
			values: args.map((arg) => snapshot(arg)),
			depth: groups.length,
			group: groups.at(-1),
			columns,
		};
		entries.push(entry);
		return entry;
	};
	const api = {
		...Object.fromEntries(
			["log", "info", "warn", "error", "debug", "dir", "dirxml"].map(
				(method) => [method, (...args: unknown[]) => emit(method, args)],
			),
		),
		table: (value: unknown, columns?: string[]) =>
			emit("table", [value], columns),
		clear: () => {
			entries = [];
			groups.length = 0;
		},
		assert: (condition: unknown, ...args: unknown[]) => {
			if (!condition) emit("assert", ["Assertion failed:", ...args]);
		},
		trace: (...args: unknown[]) =>
			emit("trace", [
				...args,
				(new Error().stack ?? "")
					.split("\n")
					.filter((line) => line.includes("runts-playground.js"))
					.join("\n") || `at playground.js:${sourceLine}`,
			]),
		count: (label = "default") => {
			const count = (counts.get(label) ?? 0) + 1;
			counts.set(label, count);
			emit("count", [`${label}: ${count}`]);
		},
		countReset: (label = "default") => {
			counts.delete(label);
		},
		time: (label = "default") => {
			timers.set(label, performance.now());
		},
		timeLog: (label = "default", ...args: unknown[]) => {
			const start = timers.get(label);
			return emit(start === undefined ? "warn" : "timeLog", [
				start === undefined
					? `Timer '${label}' does not exist`
					: `${label}: ${(performance.now() - start).toFixed(3)} ms`,
				...args,
			]);
		},
		timeEnd: (label = "default") => {
			const entry = api.timeLog(label);
			if (entry?.method === "timeLog") entry.method = "timeEnd";
			timers.delete(label);
		},
		group: (...args: unknown[]) => {
			const entry = emit("group", args);
			if (entry) groups.push(entry.id);
			return entry;
		},
		groupCollapsed: (...args: unknown[]) => {
			const entry = api.group(...args);
			if (entry) entry.collapsed = true;
		},
		groupEnd: () => {
			groups.pop();
		},
	};
	try {
		const edits: { start: number; end: number; line: number }[] = [];
		simple(
			parse(code, {
				ecmaVersion: "latest",
				locations: true,
				allowAwaitOutsideFunction: true,
			}),
			{
				MemberExpression(node) {
					if (
						node.object.type === "Identifier" &&
						node.object.name === "console"
					) {
						edits.push({
							start: node.object.start,
							end: node.object.end,
							line: node.loc?.start.line ?? 0,
						});
					}
				},
			},
		);
		let instrumented = code;
		for (const edit of edits.sort((a, b) => b.start - a.start)) {
			instrumented = `${instrumented.slice(0, edit.start)}__consoleAt(${edit.line})${instrumented.slice(edit.end)}`;
		}
		const at = (line: number) =>
			new Proxy(api, {
				get(target, property) {
					const method = Reflect.get(target, property);
					return (...args: unknown[]) => {
						sourceLine = line;
						return Reflect.apply(method, target, args);
					};
				},
			});
		await new Function(
			"console",
			"__consoleAt",
			`return (async () => {\n${instrumented}\n})();\n//# sourceURL=runts-playground.js`,
		)(api, at);
	} catch (error) {
		emit("error", [error]);
	}
	self.postMessage(entries);
};
