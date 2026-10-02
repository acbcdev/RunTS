import type { ConsoleOutput } from "./types";

export function alignLogLines(logs: ConsoleOutput[]): string {
	const aligned = logs.map(({ content, line }, index) => {
		if (index === 0) {
			return addSpaces(line, content);
		}
		return addSpaces(line - logs[index - 1].line, content);
	});
	return aligned.join("\n");
}

function addSpaces(line: number, content: string): string {
	const numRepeats = Math.max(0, line - 1);
	const spaces = "\n".repeat(numRepeats);
	return `${spaces}${content}`;
}
