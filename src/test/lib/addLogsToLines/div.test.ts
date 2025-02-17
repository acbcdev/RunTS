import { describe, it, expect } from "vitest";
import { injectLogsIntoCode } from "@/lib/addLogsToLines";

describe("injectLogsIntoCode - Division cases", () => {
  it("injects log for a simple division", () => {
    const input = "10 / 2;";
    const expected = "console.log(10 / 2)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for division with extra whitespace", () => {
    const input = "  20   /    4 ;";
    const expected = "console.log(20   /    4)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects logs for multiple division expressions", () => {
    const input = "10 / 2;\n30 / 3;";
    const expected = "console.log(10 / 2)\nconsole.log(30 / 3)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1, 2]);
  });

  it("injects log for a division chain", () => {
    const input = "100 / 2 / 5;";
    const expected = "console.log(100 / 2 / 5)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("collapses multi-line division into one line", () => {
    const input = "100 /\n 2 /\n 5;";
    const expected = "console.log(100 / 2 / 5)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not inject log for division inside a function (non top-level)", () => {
    const input = `
      function divide() {
        return 50 / 5;
      }
    `;
    const result = injectLogsIntoCode(input, { injectLogs: true });
    // La división dentro de la función no se transforma.
    expect(result.code).toContain("50 / 5");
    expect(result.lines).toEqual([]);
  });

  it("does not inject log if division is already wrapped in console.log", () => {
    const input = "console.log(80 / 4);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log(80 / 4);");
    expect(result.lines).toEqual([1]);
  });
});
