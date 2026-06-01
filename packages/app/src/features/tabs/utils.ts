export function getNameFromCode(code: string): string {
	const firstLine = code.split("\n").find((line) => line.trim() !== "");
	if (!firstLine) return "untitled";
	const trimmed = firstLine.trim();
	return trimmed.length > 15 ? trimmed.slice(0, 15) : trimmed;
}

/**
 * Swap a filename's extension, keeping the base name (everything before the
 * last dot). A nameless tab uses "untitled" as the base.
 */
export function swapExtension(name: string, ext: string): string {
	const trimmed = name.trim();
	if (!trimmed) return `untitled.${ext}`;
	const dot = trimmed.lastIndexOf(".");
	const base = dot > 0 ? trimmed.slice(0, dot) : trimmed;
	return `${base}.${ext}`;
}
