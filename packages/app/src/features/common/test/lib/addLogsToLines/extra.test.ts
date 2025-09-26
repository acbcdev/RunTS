import { describe, expect, it } from "vitest"; // Importa las funciones de Vitest
import { injectLogsIntoCode } from "@/features/common/utils/addLogsToLines"; // Ajusta la ruta

describe("injectLogsIntoCode E2E Tests (Vitest)", () => {
	// Bloque describe, ¡igual!

	it("Debería inyectar console.log en un ExpressionStatement simple", () => {
		// Caso de test it, ¡igual!
		const inputCode = "1 + 1;";
		const expectedCode = "console.log(1 + 1);";
		const result = injectLogsIntoCode(inputCode, { injectLogs: true });
		expect(result.code.trim()).toBe(expectedCode.trim()); // Assertions con expect, ¡muy similar!
	});

	it("No debería inyectar console.log si la opción injectLogs es false", () => {
		const inputCode = "1 + 1;";
		const expectedCode = "1 + 1;";
		const result = injectLogsIntoCode(inputCode, { injectLogs: false });
		expect(result.code.trim()).toBe(expectedCode.trim());
	});

	it("Debería manejar código con console.log existente sin duplicarlos", () => {
		const inputCode = 'console.log("Hola");\n2 + 2;';
		const expectedCode = 'console.log("Hola");\nconsole.log(2 + 2);';
		const result = injectLogsIntoCode(inputCode, { injectLogs: true });
		expect(result.code.trim()).toBe(expectedCode.trim());
		expect(result.lines).toEqual([1, 2]);
	});

	it("Debería funcionar con expresiones multilínea", () => {
		const inputCode =
			"\n      let x = 10;\n      x +\n      20; // Expresión multilínea\n    ";
		const expectedCode =
			"\n      let x = 10;\n      console.log(x + 20); // Expresión multilínea\n    ";
		const result = injectLogsIntoCode(inputCode.trim(), { injectLogs: true });
		expect(result.code).toBe(expectedCode.trim());
	});

	it("Should handle if statements and maintain their structure", () => {
		const inputCode =
			"\n      let x = 5;\n      if (x > 3) {\n        x + 1;\n        x * 2;\n      }\n    ";
		const expectedCode =
			"let x = 5;\n      if (x > 3) {\n        x + 1;\n        x * 2;\n      }";
		const result = injectLogsIntoCode(inputCode, { injectLogs: true });
		expect(result.code).toBe(expectedCode);
	});
	it("Error Code", () => {
		const inputCode =
			"\n'¡Hola, RunTS! 🌟';\n\n[1, 2, 3].map((x) => x * 2);\n\n475 + 465;";
		const expectedCode =
			"console.log('¡Hola, RunTS! 🌟');\n\nconsole.log([1, 2, 3].map((x) => x * 2));\n\nconsole.log(475 + 465);";
		const result = injectLogsIntoCode(inputCode, { injectLogs: true });
		expect(result.code).toBe(expectedCode);
	});
});
