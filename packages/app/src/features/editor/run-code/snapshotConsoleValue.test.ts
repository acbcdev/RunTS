import { describe, expect, it, vi } from "vitest";
import { snapshotConsoleValue } from "./snapshotConsoleValue";

describe("snapshotConsoleValue", () => {
	it("serializes cycles without mistaking shared references for cycles", () => {
		const shared = { value: 1 };
		const value: Record<string, unknown> = { first: shared, second: shared };
		value.self = value;
		const result = snapshotConsoleValue(value);
		expect(result.children?.[1][1].text).toBe("Object");
		expect(result.children?.[2][1].text).toBe("[Circular]");
		expect(() => JSON.stringify(result)).not.toThrow();
	});
	it("keeps special types and map keys as JSON-safe data", () => {
		const result = snapshotConsoleValue([
			new Map([[{ key: 1 }, 42n]]),
			new Set([true]),
			undefined,
			new Date("2026-11-19T12:00:00Z"),
			/runts/gi,
			new Error("example"),
			Promise.resolve(1),
		]);
		expect(result.children?.map(([, child]) => child.type)).toEqual([
			"object",
			"object",
			"undefined",
			"special",
			"special",
			"error",
			"special",
		]);
		expect(JSON.stringify(result)).toContain("42n");
		expect(result.children?.[0][1].text).toBe("Map(1)");
	});
	it("does not execute getters while logging", () => {
		const getter = vi.fn(() => {
			throw new Error("side effect");
		});
		const value = Object.defineProperty({}, "secret", {
			get: getter,
			enumerable: true,
		});
		expect(snapshotConsoleValue(value).children?.[0][1].text).toBe("[Getter]");
		expect(getter).not.toHaveBeenCalled();
	});
	it("bounds deeply nested and large values", () => {
		const value: Record<string, unknown> = {};
		let nested = value;
		for (let i = 0; i < 20; i++) {
			nested.child = {};
			nested = nested.child as Record<string, unknown>;
		}
		expect(JSON.stringify(snapshotConsoleValue(value))).toContain("…");
		expect(
			snapshotConsoleValue(Array.from({ length: 1000 }, (_, i) => i)).children,
		).toHaveLength(201);
	});
});
