import { describe, expect, it, vi } from "vitest";
import { captureConsole } from "./captureConsole";
import { preparePipeline } from "./pipeline";

async function execute(code: string, injectLogs = true) {
	const capture = captureConsole();
	const pipeline = preparePipeline(code, "example.ts", injectLogs);
	if (!pipeline.ready) throw new Error(pipeline.error);
	await new Function(
		"console",
		pipeline.binding,
		`return (async () => { ${pipeline.code} })()`,
	)(capture.console, capture.at);
	return capture.getOutput();
}

describe("structured console execution", () => {
	it("keeps original source lines across TypeScript, whitespace, multiline expressions and loops", async () => {
		const output = await execute(
			`\nconst users: number[] = [1, 2];\n({\n  nested: true\n});\nusers.forEach(user => console.log(user));\n\nconsole.warn("warning");\n`,
		);
		expect(
			output
				.filter((entry) => entry.content === "1" || entry.content === "2")
				.map((entry) => entry.line),
		).toEqual([6, 6]);
		expect(output.find((entry) => entry.type === "warn")?.line).toBe(8);
		expect(output.filter((entry) => entry.type === "warn")).toHaveLength(1);
		expect(output[0].line).toBe(3);
	});
	it("captures table columns and levels without logging method return values", async () => {
		const output = await execute(
			`console.info("ready");\nconsole.table([{name: "Ana", age: 25}], ["name"]);\nconsole.error("failed");`,
		);
		expect(output.map((entry) => entry.type)).toEqual([
			"info",
			"table",
			"error",
		]);
		expect(output[1].columns).toEqual(["name"]);
		expect(output[1].values[0].children?.[0][1].children?.[0]).toEqual([
			"name",
			{ type: "string", text: '"Ana"' },
		]);
	});
	it("preserves computed method calls, nested calls, and shadowed console objects", async () => {
		const output = await execute(
			`console["log"](console.info("nested"));\n{ const console = { log: (x: number) => x + 1 }; if (console.log(2) !== 3) throw new Error("shadowed"); }`,
			false,
		);
		expect(output.map((entry) => entry.type)).toEqual(["info", "log"]);
		expect(output.map((entry) => entry.line)).toEqual([1, 1]);
		expect(output[0].column).toBeGreaterThan(output[1].column);
	});
	it("keeps grouping and counters, and emits only failed assertions", async () => {
		const output = await execute(
			`console.groupCollapsed("outer");\nconsole.group("inner");\nconsole.count("render");\nconsole.count("render");\nconsole.countReset("render");\nconsole.count("render");\nconsole.assert(true, "hidden");\nconsole.assert(false, "failed");\nconsole.groupEnd();\nconsole.groupEnd();\nconsole.log("outside");`,
		);
		expect(output[0].collapsed).toBe(true);
		expect(output[2].group).toBe(output[1].id);
		expect(output[2].depth).toBe(2);
		expect(
			output
				.filter((entry) => entry.type === "count")
				.map((entry) => entry.content),
		).toEqual(['"render: 1"', '"render: 2"', '"render: 1"']);
		expect(output.filter((entry) => entry.type === "assert")).toHaveLength(1);
		expect(output.at(-1)?.depth).toBe(0);
	});

	it("preserves worker console calls when expression logging is enabled", async () => {
		const output = await execute(`const self = { console };\nself.console.warn("worker warning");`);
		expect(output.map(entry => entry.type)).toEqual(["warn"]);
		expect(output[0].line).toBe(2);
	});
	it("times labels, removes ended timers, and preserves the caller's line", async () => {
		const clock = vi
			.spyOn(performance, "now")
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(12)
			.mockReturnValueOnce(15);
		try {
			const output = await execute(
				`console.time("work");\nconsole.timeLog("work");\nconsole.timeEnd("work");\nconsole.timeEnd("work");`,
			);
			expect(output.map((entry) => entry.type)).toEqual([
				"timeLog",
				"timeEnd",
				"warn",
			]);
			expect(output.map((entry) => entry.line)).toEqual([2, 3, 4]);
			expect(output[1].content).toContain("5.000 ms");
		} finally {
			clock.mockRestore();
		}
	});
	it("captures logging after await and clears previous entries", async () => {
		const output = await execute(
			`console.log("old");\nconsole.clear();\nawait Promise.resolve();\nconsole.log("new");`,
			false,
		);
		expect(output).toHaveLength(1);
		expect(output[0].line).toBe(4);
		expect(output[0].content).toBe('"new"');
	});
	it("keeps trace origins and reports failures as typed errors", async () => {
		const output = await execute(
			`console.trace("origin");\nthrow new Error("failed");`,
		);
		expect(output[0].type).toBe("trace");
		expect(output[0].values.at(-1)?.text).toContain("source:1:1");
		expect(output[1].type).toBe("error");
	});
	it("caps output and includes a visible limit warning", async () => {
		const output = await execute(
			`for(let i = 0; i < 4100; i++) console.log(i);`,
		);
		expect(output).toHaveLength(4001);
		expect(output.at(-1)?.type).toBe("warn");
	});
});
