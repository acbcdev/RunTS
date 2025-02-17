import { describe, it, expect } from "vitest";
import { injectLogsIntoCode } from "@/lib/addLogsToLines";

describe("injectLogsIntoCode - Casos de variables", () => {
	it("no transforma una declaración de variable const", () => {
		const input = "const a = 10;";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});

	it("no transforma una declaración de variable let", () => {
		const input = "let b = 20;";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});

	it("no transforma una declaración de variable var", () => {
		const input = "var c = 30;";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});

	it("no transforma múltiples declaraciones de variables", () => {
		const input = "const a = 10;\nlet b = 20;\nvar c = 30;";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});

	it("no transforma inicializadores con operaciones aritméticas en variables", () => {
		const input = "const sum = 1 + 2;";
		const result = injectLogsIntoCode(input, { injectLogs: true });
		expect(result.code).toBe(input);
		expect(result.lines).toEqual([]);
	});
});
