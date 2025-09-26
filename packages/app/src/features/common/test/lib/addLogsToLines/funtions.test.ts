import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "@/features/common/utils/addLogsToLines";

describe("injectLogsIntoCode - Function execution cases", () => {
	it("transforms a top-level function call after an arrow function declaration", () => {
		const input = `
const add = (a, b) => {
  return a + b
}
add(1, 4156)
    `.trim();

		const expected = `
const add = (a, b) => {
  return a + b
}
console.log(add(1, 4156))
    `.trim();

		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
	});
});
