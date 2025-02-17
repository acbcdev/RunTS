import { injectLogsIntoCode } from "@/lib/addLogsToLines"; // Ajusta la ruta
import { describe, it, expect } from "vitest"; // Importa las funciones de Vitest

describe("injectLogsIntoCode E2E Tests (Vitest)", () => {
  // Bloque describe, ¡igual!

  it("Debería inyectar console.log en un ExpressionStatement simple", () => {
    // Caso de test it, ¡igual!
    const inputCode = "1 + 1;";
    const expectedCode = "console.log(1 + 1)";
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
    const expectedCode = 'console.log("Hola");\nconsole.log(2 + 2)';
    const result = injectLogsIntoCode(inputCode, { injectLogs: true });
    expect(result.code.trim()).toBe(expectedCode.trim());
    expect(result.lines).toEqual([1, 2]);
  });

  it("Debería funcionar con expresiones multilínea", () => {
    const inputCode = `
      let x = 10;
      x +
      20; // Expresión multilínea
    `;
    const expectedCode = `
      let x = 10;
      console.log(x + 20) // Expresión multilínea
    `;
    const result = injectLogsIntoCode(inputCode.trim(), { injectLogs: true });
    expect(result.code).toBe(expectedCode.trim());
  });

  it("Should handle if statements and maintain their structure", () => {
    const inputCode = `
      let x = 5;
      if (x > 3) {
        x + 1;
        x * 2;
      }
    `;
    const expectedCode = `
      let x = 5;
      if (x > 3) {
        x + 1;
        x * 2;
      }
    `;
    const result = injectLogsIntoCode(inputCode, { injectLogs: true });
    expect(result.code).toBe(expectedCode);
  });
});
