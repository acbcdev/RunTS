import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { describe, expect, it } from "vitest";

describe("injectLogsIntoCode - Comment cases", () => {
	it("leaves code unchanged if it only contains a comment", () => {
		const input = "// This is a comment";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});

	it("injects log for an expression with an inline comment", () => {
		const input = "1 + /* inline comment */ 2;";
		const expected = "console.log(1 + /* inline comment */ 2);";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});

	it("preserves a comment line before a top-level expression", () => {
		const input = `// Pre-expression comment
1 + 1;`;
		const expected = `// Pre-expression comment
console.log(1 + 1);`;
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		// The transformed expression is on the second line.
		expect(result.lines).toEqual([2]);
	});

	it("preserves an inline comment that follows an expression", () => {
		const input = "1 + 1; // addition comment";
		// El ExpressionStatement abarca solo "1 + 1;", de modo que la inyección se hace en esa porción.
		// El comentario permanece intacto luego del reemplazo.
		const expected = "console.log(1 + 1); // addition comment";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(expected);
		expect(result.lines).toEqual([1]);
	});
});
