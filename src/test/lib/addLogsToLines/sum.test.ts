import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "@/lib/addLogsToLines";

describe("injectLogsIntoCode - Suma cases", () => {
	it("injects log for a simple addition", () => {
		const input = "1 + 1;";
		const expected = "console.log(1 + 1);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects log for an addition with extra whitespace", () => {
		const input = "   3 +   4  ;";
		// El trim elimina los espacios al inicio y al final, conservando los internos.
		const expected = "console.log(3 +   4);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects logs for multiple addition expressions", () => {
		const input = "1 + 1;\n2 + 2;";
		const expected = "console.log(1 + 1);\nconsole.log(2 + 2);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1, 2]);
	});

	it("injects log for an addition chain", () => {
		const input = "1 + 2 + 3;";
		const expected = "console.log(1 + 2 + 3);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("collapses multi-line addition into one line", () => {
		const input = "1 +\n2 +\n3;";
		const expected = "console.log(1 + 2 + 3);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("does not inject log for addition inside a function (non top-level)", () => {
		const input =
			"\n      function add() {\n        return 1 + 1;\n      }\n    ";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		// La suma dentro de la función no debe transformarse.
		expect(result.code).toContain("1 + 1");
		expect(result.lines).toEqual([]);
	});

	it("does not inject log if addition is already wrapped in console.log", () => {
		const input = "console.log(2 + 2);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe("console.log(2 + 2);");
		expect(result.lines).toEqual([1]);
	});
});
