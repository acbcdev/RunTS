import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "@/features/common/utils/addLogsToLines";

describe("injectLogsIntoCode - Promise cases", () => {
	it("injects log for a simple Promise.resolve", () => {
		const input = "Promise.resolve(123);";
		const expected = "console.log(Promise.resolve(123));";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects log for a new Promise construction", () => {
		const input = "new Promise((resolve, reject) => { resolve('ok'); });";
		const expected =
			"console.log(new Promise((resolve, reject) => { resolve('ok'); }));";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("injects log for a chained promise then", () => {
		const input = "Promise.resolve(1).then(x => x + 1);";
		const expected = "console.log(Promise.resolve(1).then(x => x + 1));";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("collapses a multiline promise expression into one line", () => {
		const input = `Promise.resolve(1)
.then(x => x * 2);`;
		const expected = "console.log(Promise.resolve(1) .then(x => x * 2));";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("does not inject log if promise is already wrapped in console.log", () => {
		const input = "console.log(Promise.resolve(123));";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe("console.log(Promise.resolve(123));");
		expect(result.lines).toEqual([1]);
	});
});
