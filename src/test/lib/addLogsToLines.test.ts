import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { describe, expect, it } from "vitest";
describe("injectLogsIntoCode", () => {
  it("injects log for a simple top-level expression", () => {
    const input = "1 + 1;";
    const expected = "console.log(1 + 1)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not modify an existing console.log", () => {
    const input = "console.log('hello');";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log('hello');");
    expect(result.lines).toEqual([1]);
  });

  it("collapses multi-line expressions into one line", () => {
    const input = "1 +\n2;";
    const expected = "console.log(1 + 2)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("ignores non top-level expressions", () => {
    const input = `
      function foo() {
        1 + 1;
      }
    `;
    const result = injectLogsIntoCode(input, { injectLogs: true });
    // No se transforma la expresión dentro de la función
    expect(result.code).toContain("1 + 1;");
    expect(result.lines).toEqual([]);
  });

  it("handles multiple top-level expressions", () => {
    const input = "1 + 1;\n2 + 2;";
    const expected = "console.log(1 + 1)\nconsole.log(2 + 2)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1, 2]);
  });
});
