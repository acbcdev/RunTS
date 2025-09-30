import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "../../../utils/addLogsToLines";

describe("injectLogsIntoCode - Resta cases", () => {
  it("injects log for a simple subtraction", () => {
    const input = "5 - 3;";
    const expected = "console.log(5 - 3);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for subtraction with extra whitespace", () => {
    const input = "   10  -  4 ;";
    const expected = "console.log(10  -  4);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects logs for multiple subtraction expressions", () => {
    const input = "8 - 3;\n7 - 2;";
    const expected = "console.log(8 - 3);\nconsole.log(7 - 2);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1, 2]);
  });

  it("injects log for a subtraction chain", () => {
    const input = "20 - 5 - 3;";
    const expected = "console.log(20 - 5 - 3);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("collapses multi-line subtraction into one line", () => {
    const input = "20 -\n5 -\n3;";
    const expected = "console.log(20 - 5 - 3);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not inject log for subtraction inside a function (non top-level)", () => {
    const input =
      "\n      function subtract() {\n        return 10 - 5;\n      }\n    ";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    // La resta dentro de la función no debe transformarse.
    expect(result.code).toContain("10 - 5");
    expect(result.lines).toEqual([]);
  });

  it("does not inject log if subtraction is already wrapped in console.log", () => {
    const input = "console.log(15 - 5);";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log(15 - 5);");
    expect(result.lines).toEqual([1]);
  });
});
