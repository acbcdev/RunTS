import { describe, expect, it, vi } from "vitest";
import { preparePipeline } from "./pipeline";
import { runTab } from "./runTab";
import type { ConsoleOutput } from "./types";

const log = (line: number, content: string): ConsoleOutput => ({
	type: "log",
	content,
	line,
	column: 0,
	timestamp: 0,
});

const opts = { injectLogs: true, alignLogs: false };

describe("runTab", () => {
	it.each(["", "   \n\t  "])(
		"returns empty output for executable blank code",
		async (code) => {
			const spawn: typeof import("./runCode").runCodeWorker = async (
				source,
				options,
			) => {
				const pipeline = preparePipeline(
					source,
					options.name,
					options.injectLogs ?? false,
				);
				if (!pipeline.ready) throw new Error(pipeline.error);
				new Function(pipeline.code)();
				return [];
			};
			expect(await runTab({ name: "a.ts", code }, opts, spawn)).toBe("");
		},
	);

	it("skips non-executable languages without spawning", async () => {
		const spawn = vi.fn();
		expect(await runTab({ name: "notes.md", code: "x" }, opts, spawn)).toBe(
			null,
		);
		expect(spawn).not.toHaveBeenCalled();
	});

	it("passes code, name and injectLogs to the worker", async () => {
		const spawn = vi.fn().mockResolvedValue([]);
		await runTab({ name: "a.ts", code: "1" }, opts, spawn);
		expect(spawn).toHaveBeenCalledWith("1", { name: "a.ts", injectLogs: true });
	});

	it("joins output flat when alignLogs is off", async () => {
		const spawn = vi.fn().mockResolvedValue([log(1, "a"), log(3, "b")]);
		expect(await runTab({ name: "a.ts", code: "" }, opts, spawn)).toBe("a\nb");
	});

	it("aligns output to source lines when alignLogs is on", async () => {
		const spawn = vi.fn().mockResolvedValue([log(1, "a"), log(3, "b")]);
		expect(
			await runTab(
				{ name: "a.ts", code: "" },
				{ ...opts, alignLogs: true },
				spawn,
			),
		).toBe("a\n\nb");
	});

	it("turns worker failures into the log text", async () => {
		const spawn = vi.fn().mockRejectedValue(new Error("timeout"));
		expect(await runTab({ name: "a.ts", code: "" }, opts, spawn)).toBe(
			"Error: timeout",
		);
	});
});
