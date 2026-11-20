export type ConsoleValue = {
	type: string;
	text: string;
	children?: [string, ConsoleValue][];
	array?: boolean;
};

export type ConsoleMethod =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "debug"
	| "dir"
	| "dirxml"
	| "table"
	| "group"
	| "groupCollapsed"
	| "assert"
	| "trace"
	| "count"
	| "timeLog"
	| "timeEnd";

export interface ConsoleOutput {
	id: number;
	type: ConsoleMethod;
	content: string;
	values: ConsoleValue[];
	depth: number;
	group?: number;
	collapsed?: boolean;
	columns?: string[];
	line: number;
	column: number;
	timestamp: number;
}

export type RunCodeOptions = {
	injectLogs: boolean;
	name: string;
	timeoutWorker: number;
	hideUndefined: boolean;
};
