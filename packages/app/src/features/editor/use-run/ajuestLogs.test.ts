import { describe, expect, it } from "vitest";
import { ajuestLogs, type ConsoleOutput } from "./ajuestLogs";

const createMockLog = (line: number, content: string): ConsoleOutput => ({
	type: "log",
	content,
	line,
	column: 0,
	timestamp: Date.now(),
});

describe("ajuestLogs", () => {
	it("should return an empty string for empty logs", () => {
		const logs: ConsoleOutput[] = [];
		const result = ajuestLogs(logs);
		expect(result).toBe("");
	});

	it("should handle a single log", () => {
		const logs = [createMockLog(1, "hello")];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello");
	});

	it("should handle multiple logs on the same line", () => {
		const logs = [createMockLog(1, "hello"), createMockLog(1, "world")];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello\nworld");
	});

	it("should handle multiple logs on different lines", () => {
		const logs = [createMockLog(1, "hello"), createMockLog(3, "world")];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello\n\nworld");
	});

	it("should handle logs with line number 0", () => {
		const logs = [createMockLog(0, "hello")];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello");
	});
});
