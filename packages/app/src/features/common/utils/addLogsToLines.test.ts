import { describe, expect, it } from "vitest";
import { injectLogsIntoCode } from "./addLogsToLines";

describe("injectLogsIntoCode", () => {
  describe("Counting Mode (injectLogs: false)", () => {
    it("should count existing console.log statements", () => {
      const code = `
console.log("first");
const x = 1;
console.log("second");
function test() {
  console.log("inside function");
}
console.log("third");
      `;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([4, 6, 8, 10]);
      expect(result.code).toBe(code);
    });

    it("should return empty array when no console.log statements exist", () => {
      const code = `
const x = 1;
const y = 2;
function test() {
  return x + y;
}
      `;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([]);
      expect(result.code).toBe(code);
    });

    it("should handle code with only console.log statements", () => {
      const code = `console.log("only log");`;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([1]);
      expect(result.code).toBe(code);
    });

    it("should handle malformed code gracefully in counting mode", () => {
      const code = `
console.log("first");
const x =
console.log("second");
      `;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([4]);
      expect(result.code).toBe(code);
    });

    it("should count console.log with trimmed code", () => {
      const code = `

console.log("test");

      `;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([7]);
    });

    it("should handle multiple console.log statements", () => {
      const code = `
console.log("one");
console.log("two");
console.log("three");
      `;

      const result = injectLogsIntoCode(code, { injectLogs: false });
      expect(result.lines).toEqual([4, 5, 6]);
    });
  });

  describe("Injection Mode (injectLogs: true)", () => {
    describe("Top-Level Expression Statements", () => {
      it("should inject console.log for top-level function calls", () => {
        const code = `Math.max(1, 2, 3);`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(Math.max(1, 2, 3));");
        expect(result.lines).toEqual([1]);
      });

      it("should inject console.log for multiple top-level function calls", () => {
        const code = `
parseInt("42");
obj.method();
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain('console.log(parseInt("42"));');
        expect(result.code).toContain("console.log(obj.method());");
        expect(result.lines.length).toBe(2);
      });

      it("should handle semicolon presence correctly", () => {
        const code = `
Math.random()
Math.floor(5);
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(Math.random())");
        expect(result.code).toContain("console.log(Math.floor(5));");
      });

      it("should inject console.log for arithmetic expressions", () => {
        const code = `1 + 2;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(1 + 2);");
      });

      it("should inject console.log for string literals", () => {
        const code = `"hello world";`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe('console.log("hello world");');
      });

      it("should inject console.log for template literals", () => {
        const code = "`Hello ${name}`;";

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(`Hello ${name}`);");
      });

      it("should inject console.log for boolean values", () => {
        const code = `
true;
false;
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(true);");
        expect(result.code).toContain("console.log(false);");
      });

      it("should inject console.log for null and undefined", () => {
        const code = `
null;
undefined;
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(null);");
        expect(result.code).toContain("console.log(undefined);");
      });
    });

    describe("Object and Array Expressions", () => {
      it("should inject console.log for object expressions with parentheses", () => {
        const code = `({ a: 1, b: 2 });`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(({ a: 1, b: 2 }));");
      });

      it("should handle nested objects", () => {
        const code = `({ outer: { inner: "value" } });`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe(
          'console.log(({ outer: { inner: "value" } }));'
        );
      });

      it("should handle multiline objects", () => {
        const code = `({
  a: 1,
  b: 2
});`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(({ a: 1, b: 2 }));");
      });

      it("should inject console.log for array expressions", () => {
        const code = `[1, 2, 3];`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log([1, 2, 3]);");
      });

      it("should handle nested arrays", () => {
        const code = `[[1, 2], [3, 4]];`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log([[1, 2], [3, 4]]);");
      });

      it("should handle multiline arrays", () => {
        const code = `[
  1,
  2,
  3
];`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log([ 1, 2, 3 ]);");
      });
    });

    describe("Existing Console.log Preservation", () => {
      it("should preserve existing console.log statements", () => {
        const code = `
console.log("existing log");
Math.random();
console.log("another existing");
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain('console.log("existing log");');
        expect(result.code).toContain('console.log("another existing");');
        expect(result.code).toContain("console.log(Math.random());");
      });

      it("should count existing console.log lines correctly", () => {
        const code = `
console.log("first");
Math.random();
console.log("second");
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.lines).toContain(1); // existing log
        expect(result.lines).toContain(3); // injected log
        expect(result.lines).toContain(4); // existing log
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty code", () => {
        const code = "";

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("");
        expect(result.lines).toEqual([]);
      });

      it("should handle code with only whitespace", () => {
        const code = "   \n\t  \n  ";

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("");
        expect(result.lines).toEqual([]);
      });

      it("should handle malformed code gracefully", () => {
        const code = `
const x = ;
const y = "
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBeDefined();
        expect(Array.isArray(result.lines)).toBe(true);
      });

      it("should handle multiple expressions on same line", () => {
        const code = `1; 2; 3;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(1);");
        expect(result.code).toContain("console.log(2);");
        expect(result.code).toContain("console.log(3);");
      });
    });

    describe("Conditional and Logical Expressions", () => {
      it("should handle ternary expressions", () => {
        const code = `x > 0 ? "positive" : "negative";`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe(
          'console.log(x > 0 ? "positive" : "negative");'
        );
      });

      it("should handle logical operators", () => {
        const code = `isValid && hasPermission;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(isValid && hasPermission);");
      });
    });

    describe("Async/Await Expressions", () => {
      it("should handle Promise expressions", () => {
        const code = `Promise.resolve("done");`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe('console.log(Promise.resolve("done"));');
      });

      it("should handle await expressions", () => {
        const code = `await fetch("/api/data");`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe('console.log(await fetch("/api/data"));');
      });
    });

    describe("Unary and Binary Expressions", () => {
      it("should handle unary expressions", () => {
        const code = `
-42;
+42;
!condition;
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(-42);");
        expect(result.code).toContain("console.log(+42);");
        expect(result.code).toContain("console.log(!condition);");
      });

      it("should handle bitwise operators", () => {
        const code = `a & b;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log(a & b);");
      });

      it("should handle complex arithmetic", () => {
        const code = `(a + b) * (c - d) / e;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("console.log((a + b) * (c - d) / e);");
      });
    });

    describe("New Expressions", () => {
      it("should handle new expressions", () => {
        const code = `
new Date();
new MyClass();
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(new Date());");
        expect(result.code).toContain("console.log(new MyClass());");
      });
    });

    describe("Line Number Tracking", () => {
      it("should return correct line numbers for injected logs", () => {
        const code = `
1 + 2;
"hello";
[1, 2, 3];
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.lines).toHaveLength(3);
        expect(result.lines[0]).toBeLessThan(result.lines[1]);
        expect(result.lines[1]).toBeLessThan(result.lines[2]);
      });

      it("should handle line numbers with trimmed code", () => {
        const code = `

42;

        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.lines).toEqual([5]);
      });
    });

    describe("Complex Real-World Scenarios", () => {
      it("should handle complex nested structures", () => {
        const code = `({
  data: [1, 2, { nested: "value" }],
  func: function() { return "test"; }
});`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain(
          'console.log(({ data: [1, 2, { nested: "value" }], func: function() { return "test"; } }));'
        );
      });

      it("should handle mixed expressions", () => {
        const code = `
1 + 2;
[1, 2, 3];
({ x: 10 });
console.log("existing");
"test";
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain("console.log(1 + 2);");
        expect(result.code).toContain("console.log([1, 2, 3]);");
        expect(result.code).toContain("console.log(({ x: 10 }));");
        expect(result.code).toContain('console.log("existing");');
        expect(result.code).toContain('console.log("test");');
      });

      it("should handle function calls with complex arguments", () => {
        const code = `
fetch("/api", { method: "POST", body: JSON.stringify({ data: [1, 2, 3] }) });
Math.max(...[1, 2, 3, 4, 5]);
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toContain(
          'console.log(fetch("/api", { method: "POST", body: JSON.stringify({ data: [1, 2, 3] }) }));'
        );
        expect(result.code).toContain(
          "console.log(Math.max(...[1, 2, 3, 4, 5]));"
        );
      });
    });

    describe("Variable Declarations (Not Injected)", () => {
      it("should NOT inject logs for variable declarations", () => {
        const code = `const x = 42;`;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe("const x = 42;");
        expect(result.lines).toEqual([]);
      });

      it("should NOT inject logs for multiple variable declarations", () => {
        const code = `
const x = 42;
let y = "hello";
var z = true;
        `;

        const result = injectLogsIntoCode(code, { injectLogs: true });
        expect(result.code).toBe(`const x = 42;
let y = "hello";
var z = true;`);
        expect(result.lines).toEqual([]);
      });
    });
  });

  describe("Default Options", () => {
    it("should default to counting mode when no options provided", () => {
      const code = `
console.log("test");
const x = 42;
      `;

      const result = injectLogsIntoCode(code);
      expect(result.lines).toEqual([4]);
      expect(result.code).toBe(code);
    });
  });
});
