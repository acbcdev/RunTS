import { describe, expect, it } from "vitest";
import { Formatter } from "@/features/common/utils/formatter";

describe("Formatter", () => {
	it("should format a simple number", () => {
		const input = 123;
		const expected = "123";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format a simple string", () => {
		const input = "hello";
		const expected = '"hello"';
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format a simple boolean", () => {
		const input = true;
		const expected = "true";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format null", () => {
		const input = null;
		const expected = "null";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format undefined", () => {
		const input = undefined;
		const expected = "undefined";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format an array of numbers", () => {
		const input = [1, 2, 3];
		const expected = "[ 1, 2, 3 ]";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format an array of strings", () => {
		const input = ["a", "b", "c"];
		const expected = '[ "a", "b", "c" ]';
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format a function", () => {
		const input = function myFunc() {};
		const expected = "ƒ function myFunc()";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format an anonymous function", () => {
		const input = () => {};
		const expected = "ƒ function input()";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format a Map", () => {
		const input = new Map([
			["a", 1],
			["b", 2],
		]);
		const expected = 'Map (2) {\n  "a" => 1,\n  "b" => 2\n}';
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format a Set", () => {
		const input = new Set([1, 2, 3]);
		const expected = "Set(3) {\n  1,\n  2,\n  3 \n}";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});

	it("should format an Error", () => {
		const input = new Error("Test Error");
		const expected = "Error: Error - Test Error";
		const result = Formatter(input);
		expect(result).toBe(expected);
	});
});
