import type { ConsoleOutput } from "@/features/editor/types";

export function ajuestLogs(logs: ConsoleOutput[]): string {
	const ajustedOutput = logs.map(({ content, line }, index) => {
		// if (index === 0) return value;
		if (index === 0) {
			return addSpaces(line, content);
		}
		return addSpaces(line - logs[index - 1].line, content);
		// return { ...value, line: value.line - logs[index - 1].line };
	});
	return ajustedOutput.join("\n");
}

function addSpaces(line: number, content: string): string {
	const numRepeats = Math.max(0, line - 1);
	const spaces = "\n".repeat(numRepeats);
	return `${spaces}${content}`;
}
