type FormatterOptions = {
	depth: number;
	currentDepth: number;
	hideUndefined?: boolean;
};
export function Formatter<T>(
	item: T,
	options: FormatterOptions = {
		depth: 5,
		currentDepth: 0,
		hideUndefined: false,
	},
): string {
	if (options.currentDepth > options.depth) return "...";

	if (Array.isArray(item)) {
		return `[ ${item
			.map((el) =>
				Formatter(el, {
					depth: options.depth,
					currentDepth: options.currentDepth + 1,
				}),
			)
			.join(", ")} ]`;
	}
	if (typeof item === "function") {
		return `ƒ function ${item.name || "anonymous"}()`;
	}

	if (item !== null && typeof item === "object") {
		if (item instanceof Map) {
			return `Map (${item.size}) {\n${[...item.entries()]
				.map(
					([key, value]) =>
						`  ${Formatter(key, {
							depth: options.depth,
							currentDepth: options.currentDepth + 1,
						})} => ${Formatter(value, {
							depth: options.depth,
							currentDepth: options.currentDepth + 1,
						})}`,
				)
				.join(",\n")}\n}`;
		}
		if (item instanceof Set) {
			return `Set(${item.size}) {\n  ${[...item.values()]
				.map((value) =>
					Formatter(value, {
						depth: options.depth,
						currentDepth: options.currentDepth + 1,
					}),
				)
				.join(",\n  ")} \n}`;
		}
		if (item instanceof Error) {
			return `Error: ${item.name} - ${item.message}`;
		}

		const entries = Object.entries(item)
			.map(
				([key, value]) =>
					`  ${key}: ${Formatter(value, {
						depth: options.depth,
						currentDepth: options.currentDepth + 1,
					})}`,
			)
			.join(",\n");
		return `{\n${entries}\n}`;
	}

	if (typeof item === "string") return `"${item}"`;
	if (typeof item === "number" || typeof item === "boolean")
		return String(item);
	if (typeof item === "bigint") return `${item}n`;
	if (item === null) return "null";
	if (item === undefined) return options.hideUndefined ? "" : "undefined";

	return String(item);
}
