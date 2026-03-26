export function getNameFromCode(code: string): string {
	const firstLine = code.split("\n").find((line) => line.trim() !== "");
	if (!firstLine) return "untitled";
	const trimmed = firstLine.trim();
	return trimmed.length > 15 ? trimmed.slice(0, 15) : trimmed;
}
