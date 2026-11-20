import type { ConsoleOutput } from "../run-code/types";

export type ConsoleViewProps = {
	entries: ConsoleOutput[];
	onHover: (line: number | null) => void;
	onPin: (line: number) => void;
	pinned: number | null;
	fileName: string;
	lineNumbers: boolean;
};
