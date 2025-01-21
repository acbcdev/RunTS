export function Formatter<T>(item: T, depth = 5, currentDepth = 0): string {
  if (currentDepth > depth) return "...";

  if (Array.isArray(item)) {
    return `[ ${item.map((el) => Formatter(el, depth, currentDepth + 1)).join(", ")} ]`;
  }

  if (item !== null && typeof item === "object") {
    if (item instanceof Map) {
      return `Map (${item.size}) {\n${[...item.entries()]
        .map(
          ([key, value]) =>
            `  ${Formatter(key, depth, currentDepth + 1)} => ${Formatter(value, depth, currentDepth + 1)}`,
        )
        .join(",\n")}\n}`;
    }
    if (item instanceof Set) {
      return `Set(${item.size}) {\n  ${[...item.values()].map((value) => Formatter(value, depth, currentDepth + 1)).join(",\n  ")} \n}`;
    }
    if (item instanceof Error) {
      return `Error: ${item.name} - ${item.message}`;
    }

    const entries = Object.entries(item)
      .map(
        ([key, value]) =>
          `  ${key}: ${Formatter(value, depth, currentDepth + 1)}`,
      )
      .join(",\n");
    return `{\n${entries}\n}`;
  }

  if (typeof item === "string") return `"${item}"`;
  if (typeof item === "number" || typeof item === "boolean")
    return String(item);
  if (typeof item === "bigint") return `${item}n`;
  if (item === null) return "null";
  if (item === undefined) return "undefined";

  return String(item);
}
