import { describe, it, expect } from "vitest";
import { injectLogsIntoCode } from "@/lib/addLogsToLines";

describe("injectLogsIntoCode - Multiplication cases", () => {
  it("injects log for a simple multiplication", () => {
    const input = "2 * 3;";
    const expected = "console.log(2 * 3)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for multiplication with extra whitespace", () => {
    const input = "   4   *    5 ;";
    const expected = "console.log(4   *    5)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects logs for multiple multiplication expressions", () => {
    const input = "2 * 3;\n4 * 5;";
    const expected = "console.log(2 * 3)\nconsole.log(4 * 5)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1, 2]);
  });

  it("injects log for a multiplication chain", () => {
    const input = "2 * 3 * 4;";
    const expected = "console.log(2 * 3 * 4)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("collapses multi-line multiplication into one line", () => {
    const input = "2 *\n3 *\n4;";
    const expected = "console.log(2 * 3 * 4)";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not inject log for multiplication inside a function (non top-level)", () => {
    const input = `
      function multiply() {
        return 3 * 4;
      }
    `;
    const result = injectLogsIntoCode(input, { injectLogs: true });
    // La multiplicación dentro de la función no debe transformarse.
    expect(result.code).toContain("3 * 4");
    expect(result.lines).toEqual([]);
  });

  it("does not inject log if multiplication is already wrapped in console.log", () => {
    const input = "console.log(6 * 7);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log(6 * 7);");
    expect(result.lines).toEqual([1]);
  });
});
