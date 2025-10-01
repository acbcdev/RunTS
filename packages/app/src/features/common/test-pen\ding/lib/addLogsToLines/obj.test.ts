import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "../../../utils/addLogsToLines";

describe("injectLogsIntoCode - Object cases", () => {
  it("injects log for a simple object literal", () => {
    const input = "({ a: 1, b: 2 });";
    const expected = "console.log(({ a: 1, b: 2 }));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for an object literal with extra whitespace", () => {
    const input = "({ x: 10, y:20  });";
    const expected = "console.log(({ x: 10, y:20  }));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects logs for multiple object literals", () => {
    const input = "({ a: 1 });\n({ b: 2 });";
    const expected = "console.log(({ a: 1 }));\nconsole.log(({ b: 2 }));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1, 2]);
  });

  it("collapses multi-line object literal into one line", () => {
    const input = `
({  a: 1,  b: 2});
    `.trim();
    const expected = "console.log(({  a: 1,  b: 2}));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not inject log for object literal inside a function (non top-level)", () => {
    const input = `
      function getObject() {
        return { c: 3, d: 4 };
      }
    `;
    const result = injectLogsIntoCode(input, { injectLogs: true });
    // La literal de objeto dentro de la función no se transforma.
    expect(result.code).toContain("{ c: 3, d: 4 }");
    expect(result.lines).toEqual([]);
  });

  it("does not inject log if object literal is already wrapped in console.log", () => {
    const input = "console.log({ e: 5, f: 6 });";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log({ e: 5, f: 6 });");
    expect(result.lines).toEqual([1]);
  });
});
