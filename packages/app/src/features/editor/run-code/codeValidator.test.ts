import { describe, it, expect } from "vitest";
import { validateCode, wrapCodeForExecution } from "./codeValidator";

describe("codeValidator", () => {
	describe("validateCode", () => {
		it("should reject empty code", () => {
			const result = validateCode("");
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("Code cannot be empty");
		});

		it("should reject whitespace-only code", () => {
			const result = validateCode("   \n\t\n  ");
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("Code cannot be empty");
		});

		it("should reject Object.getOwnPropertyNames", () => {
			const code = "Object.getOwnPropertyNames({})";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain(
				"Object.getOwnPropertyNames is not allowed"
			);
		});

		it("should reject Object.getPrototypeOf", () => {
			const code = "Object.getPrototypeOf(function(){})";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("Object.getPrototypeOf is not allowed");
		});

		it("should reject Object.getOwnPropertyDescriptor", () => {
			const code = "Object.getOwnPropertyDescriptor({}, 'key')";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain(
				"Object.getOwnPropertyDescriptor is not allowed"
			);
		});

		it("should reject Function constructor", () => {
			const code = "new Function('return this')()";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("Dynamic Function creation is not allowed");
		});

		it("should reject eval", () => {
			const code = "eval('console.log(1)')";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("eval() is not allowed");
		});

		it("should reject importScripts", () => {
			const code = "importScripts('worker.js')";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("importScripts is not allowed in user code");
		});

		it("should reject postMessage to worker scope", () => {
			const code = "postMessage({type: 'hello'})";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("postMessage is not allowed");
		});

		it("should reject direct self access (except console/setTimeout)", () => {
			const code = "self.name = 'test'";
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain("Direct access to worker scope is restricted");
		});

		it("should allow safe code", () => {
			const code = "console.log('Hello'); const x = 5; console.log(x);";
			const result = validateCode(code);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("should allow multiple statements", () => {
			const code = `
				let count = 0;
				for (let i = 0; i < 10; i++) {
					count += i;
				}
				console.log(count);
			`;
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should allow arrow functions", () => {
			const code = "const add = (a, b) => a + b; console.log(add(2, 3));";
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should allow async/await", () => {
			const code = `
				const fetchData = async () => {
					const result = await Promise.resolve([1, 2, 3]);
					console.log(result);
				};
				fetchData();
			`;
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should allow setTimeout", () => {
			const code = "setTimeout(() => console.log('done'), 100);";
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should allow console methods", () => {
			const code = `
				console.log('log');
				console.error('error');
				console.warn('warn');
				console.info('info');
			`;
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should reject code exceeding max length", () => {
			const code = "a".repeat(1_000_001);
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain("exceeds maximum length");
		});

		it("should allow code at max length", () => {
			const code = `console.log('test');\n${"// comment\n".repeat(50000)}`;
			const result = validateCode(code);
			expect(result.valid).toBe(true);
		});

		it("should detect multiple violations", () => {
			const code = `
				eval('code');
				Object.getOwnPropertyNames({});
				new Function('return this')();
			`;
			const result = validateCode(code);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});
	});

	describe("wrapCodeForExecution", () => {
		it("should wrap code in try-catch", () => {
			const code = "console.log('test');";
			const wrapped = wrapCodeForExecution(code);
			expect(wrapped).toContain("try {");
			expect(wrapped).toContain("} catch (error) {");
			expect(wrapped).toContain('console.error("Execution error:"');
		});

		it("should preserve code indentation", () => {
			const code = `const x = 5;
console.log(x);`;
			const wrapped = wrapCodeForExecution(code);
			expect(wrapped).toContain("\tconst x = 5;");
			expect(wrapped).toContain("\tconsole.log(x);");
		});

		it("should handle multiline code", () => {
			const code = `
const arr = [1, 2, 3];
arr.forEach(item => {
	console.log(item * 2);
});
			`;
			const wrapped = wrapCodeForExecution(code);
			expect(wrapped).toContain("try {");
			expect(wrapped).toContain("} catch (error) {");
		});

		it("should handle empty lines", () => {
			const code = "console.log('test');\n\nconsole.log('done');";
			const wrapped = wrapCodeForExecution(code);
			const lines = wrapped.split("\n");
			// Should have proper indentation for all lines
			expect(lines.some((line) => line.startsWith("\t"))).toBe(true);
		});
	});
});
