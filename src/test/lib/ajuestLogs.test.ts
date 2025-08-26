import { ajuestLogs } from "@/lib/ajuestLogs";
import { describe, expect, it } from "vitest";

describe("ajuestLogs", () => {
	it("should return an empty string for empty logs", () => {
		const logs = [];
		const result = ajuestLogs(logs);
		expect(result).toBe("");
	});

	it("should handle a single log", () => {
		const logs = [{ line: 1, content: "hello" }];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello");
	});

	it("should handle multiple logs on the same line", () => {
		const logs = [
			{ line: 1, content: "hello" },
			{ line: 1, content: "world" },
		];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello\nworld");
	});

	it("should handle multiple logs on different lines", () => {
		const logs = [
			{ line: 1, content: "hello" },
			{ line: 3, content: "world" },
		];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello\n\nworld");
	});

	it("should handle logs with line number 0", () => {
		const logs = [{ line: 0, content: "hello" }];
		const result = ajuestLogs(logs);
		expect(result).toBe("hello");
	});
});
