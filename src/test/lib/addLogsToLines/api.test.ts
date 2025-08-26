import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { describe, expect, it } from "vitest";

describe("injectLogsIntoCode - API and Method calls", () => {
  it("injects log for a static API method call (Math.max)", () => {
    const input = "Math.max(1, 2);";
    const expected = "console.log(Math.max(1, 2));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for an object method call", () => {
    const input = "const obj = { foo() { return 'bar'; } };\nobj.foo();";
    const expected =
      "const obj = { foo() { return 'bar'; } };\nconsole.log(obj.foo());";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    // La declaración de variable se mantiene intacta; solo se transforma la llamada a obj.foo()
    expect(result.lines).toEqual([2]);
  });

  it("injects log for chained method calls", () => {
    const input = "String('hello').trim().toUpperCase();";
    const expected = "console.log(String('hello').trim().toUpperCase());";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("injects log for an API call with arguments", () => {
    const input = "Array.from('test');";
    const expected = "console.log(Array.from('test'));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe(expected);
    expect(result.lines).toEqual([1]);
  });

  it("does not transform if API/method call is already wrapped in console.log", () => {
    const input = "console.log(Math.min(5, 10));";
    const result = injectLogsIntoCode(input, { injectLogs: true });
    expect(result.code).toBe("console.log(Math.min(5, 10));");
    expect(result.lines).toEqual([1]);
  });
});
