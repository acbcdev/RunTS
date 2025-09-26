import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "@/features/common/utils/addLogsToLines";

describe("injectLogsIntoCode - Arrays cases", () => {
	it("injects log for a simple array literal", () => {
		const input = "[1, 2, 3]";
		const expected = "console.log([1, 2, 3])";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects log for an array with extra whitespace", () => {
		const input = "   [ 4, 5, 6 ]   ";
		const expected = "console.log([ 4, 5, 6 ])";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects logs for multiple array literals", () => {
		const input = "[1,2,3];\n[4,5,6]";
		const expected = "console.log([1,2,3]);\nconsole.log([4,5,6])";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1, 2]);
	});

	it("collapses multi-line array literal into one line", () => {
		const input = `[1, 2,
  3, 4]`;
		const expected = "console.log([1, 2, 3, 4])";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("does not inject log for array literal inside a function (non top-level)", () => {
		const input = `
      function getArray() {
        return [7, 8, 9];
      }
    `;
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toContain("[7, 8, 9]");
		expect(result.lines).toEqual([]);
	});

	it("does not inject log if array literal is already wrapped in console.log", () => {
		const input = "console.log([10, 11, 12])";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe("console.log([10, 11, 12])");
		expect(result.lines).toEqual([1]);
	});
});
