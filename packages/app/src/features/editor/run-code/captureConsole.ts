import { snapshotConsoleValue } from "./snapshotConsoleValue";
import type { ConsoleMethod, ConsoleOutput, ConsoleValue } from "./types";

function formatValue(value: ConsoleValue): string {
	if (!value.children) return value.text;
	const items = value.children
		.map(([key, child]) => `${key}: ${formatValue(child)}`)
		.join(", ");
	return `${value.text} { ${items} }`;
}

export function captureConsole() {
	let output: ConsoleOutput[] = [];
	let id = 0;
	let position = { line: 0, column: 0 };
	let limitReached = false;
	const groups: number[] = [];
	const timers = new Map<string, number>();
	const counts = new Map<string, number>();
	function emit(type: ConsoleMethod, args: unknown[], columns?: string[]) {
		if (limitReached) return;
		if (output.length >= 4000) {
			limitReached = true;
			type = "warn";
			args = ["Output limit reached: No more logs will be recorded. max 4000"];
		}
		const values = args.map((value) => snapshotConsoleValue(value));
		const entry: ConsoleOutput = {
			id: id++,
			type,
			values,
			content: values.map(formatValue).join(" "),
			...position,
			timestamp: Date.now(),
			depth: groups.length,
			group: groups.at(-1),
			columns,
		};
		output.push(entry);
		return entry;
	}
	const timer = (
		type: "timeLog" | "timeEnd",
		label: string,
		args: unknown[],
	) => {
		const start = timers.get(label);
		if (start === undefined) emit("warn", [`Timer '${label}' does not exist`]);
		else
			emit(type, [
				`${label}: ${(performance.now() - start).toFixed(3)} ms`,
				...args,
			]);
	};
	const group = (type: "group" | "groupCollapsed", args: unknown[]) => {
		const entry = emit(type, args);
		if (entry) {
			entry.collapsed = type === "groupCollapsed";
			groups.push(entry.id);
		}
	};
	const api = {
		log: (...args: unknown[]) => {
			emit("log", args);
		},
		info: (...args: unknown[]) => {
			emit("info", args);
		},
		warn: (...args: unknown[]) => {
			emit("warn", args);
		},
		error: (...args: unknown[]) => {
			emit("error", args);
		},
		debug: (...args: unknown[]) => {
			emit("debug", args);
		},
		dir: (value: unknown) => {
			emit("dir", [value]);
		},
		dirxml: (...args: unknown[]) => {
			emit("dirxml", args);
		},
		table: (value: unknown, columns?: string[]) => {
			emit("table", [value], columns);
		},
		clear: () => {
			output = [];
			groups.length = 0;
		},
		assert: (condition: unknown, ...args: unknown[]) => {
			if (!condition) emit("assert", ["Assertion failed:", ...args]);
		},
		trace: (...args: unknown[]) => {
			emit("trace", [
				...args,
				`at source:${position.line}:${position.column + 1}`,
			]);
		},
		count: (label = "default") => {
			const count = (counts.get(label) ?? 0) + 1;
			counts.set(label, count);
			emit("count", [`${label}: ${count}`]);
		},
		countReset: (label = "default") => {
			counts.delete(label);
		},
		time: (label = "default") => {
			if (timers.has(label)) emit("warn", [`Timer '${label}' already exists`]);
			else timers.set(label, performance.now());
		},
		timeLog: (label = "default", ...args: unknown[]) => {
			timer("timeLog", label, args);
		},
		timeEnd: (label = "default") => {
			timer("timeEnd", label, []);
			timers.delete(label);
		},
		group: (...args: unknown[]) => {
			group("group", args);
		},
		groupCollapsed: (...args: unknown[]) => {
			group("groupCollapsed", args);
		},
		groupEnd: () => {
			groups.pop();
		},
	};
	return {
		console: api,
		getOutput: () => output,
		reportError: (error: unknown) => {
			position = { line: 0, column: 0 };
			emit("error", [error]);
		},
		at: (target: unknown, line: number, column: number) =>
			target !== api
				? target
				: new Proxy(api, {
						get(object, property) {
							const method = Reflect.get(object, property);
							if (typeof method !== "function") return method;
							return (...args: unknown[]) => {
								const previous = position;
								position = { line, column };
								try {
									return Reflect.apply(method, object, args);
								} finally {
									position = previous;
								}
							};
						},
					}),
	};
}
