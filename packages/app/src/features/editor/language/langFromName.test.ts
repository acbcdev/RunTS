import { describe, expect, it } from "vitest";
import { langFromName } from "./langFromName";

describe("langFromName", () => {
	it.each([
		["undefined (unnamed)", undefined, "typescript"],
		["empty string (unnamed)", "", "typescript"],
		["main.ts", "main.ts", "typescript"],
		["app.js", "app.js", "javascript"],
		["notes (no ext)", "notes", "plaintext"],
		["README.md", "README.md", "plaintext"],
		[".md", ".md", "plaintext"],
		[
			"my.config.ts (multi-dot, last segment wins)",
			"my.config.ts",
			"typescript",
		],
		["Main.TS (case-insensitive)", "Main.TS", "typescript"],
		["weird. (trailing dot)", "weird.", "plaintext"],
		[".gitignore (dotfile)", ".gitignore", "plaintext"],
	])("derives %s -> %s", (_label, input, expected) => {
		expect(langFromName(input as string | undefined).id).toBe(expected);
	});

	it("returns the full LanguageDef, not just the id", () => {
		expect(langFromName("main.ts")).toEqual({
			id: "typescript",
			monaco: "typescript",
			execute: true,
			panel: "console",
		});
		expect(langFromName("notes")).toEqual({
			id: "plaintext",
			monaco: "plaintext",
			execute: false,
			panel: "none",
		});
	});
});
