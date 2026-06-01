import { describe, expect, it } from "vitest";
import { swapExtension } from "./utils";

describe("swapExtension", () => {
	it.each([
		["keep base", "main.ts", "js", "main.js"],
		["last dot wins with multiple dots", "my.utils.ts", "js", "my.utils.js"],
		["empty -> untitled", "", "js", "untitled.js"],
		["whitespace-only -> untitled", "   ", "ts", "untitled.ts"],
		["unknown extension input still swaps", "notes.txt", "ts", "notes.ts"],
		["no extension gets one", "notes", "ts", "notes.ts"],
	])("%s", (_label, name, ext, expected) => {
		expect(swapExtension(name, ext)).toBe(expected);
	});
});
