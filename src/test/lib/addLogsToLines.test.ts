import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { describe, expect, test } from "vitest";

describe("addLogsToLines declaration tests", () => {
	test("simple const declaration", () => {
		expect(
			injectLogsIntoCode(`
const a = 1;
const b = 2;
const c = a + b;
console.log(c);
a
b
`),
		).toBe(`const a = 1;
const b = 2;
const c = a + b;
console.log(c);
a
console.log(a);
b
console.log(b);`);
	});

	test("simple const declaration with comments", () => {
		expect(
			injectLogsIntoCode(`
const a = 1; // a
const b = 2; // b
const c = a + b; // c
console.log(c); // c
a // a
b // b
`),
		).toBe(`const a = 1; // a
const b = 2; // b
const c = a + b; // c
console.log(c); // c
a // a
console.log(a);
b // b
console.log(b);`);
	});

	test("simple const declaration with multiple lines", () => {
		expect(
			injectLogsIntoCode(`
const a = 1;
const b = 2;
const c = a + b;
c
a
b
`),
		).toBe(`const a = 1;
const b = 2;
const c = a + b;
c
console.log(c);
a
console.log(a);
b
console.log(b);`);
	});

	test("simple let declaration", () => {
		expect(
			injectLogsIntoCode(`
let a = 1;
a = 54;
a

`),
		).toBe(`let a = 1;
a = 54;
console.log(a);
a
console.log(a);`);
	});

	test("simple funtion declaration", () => {
		expect(
			injectLogsIntoCode(`
function a() {
	console.log("a");
}
a()
`),
		).toBe(`function a() {
	console.log("a");
}
a()
console.log(a());`);
	});
	test("simple funtion declaration with multiple lines", () => {
		expect(
			injectLogsIntoCode(`
function helloTo(name) {
	return 'hello ' + name;
}
	helloTo('world')
	`),
		).toBe(`function helloTo(name) {
	return 'hello ' + name;
}
	helloTo('world')
console.log(helloTo('world'));`);
	});
});

describe("addLogsToLines operation tests", () => {
	test("directed operation +", () => {
		expect(injectLogsIntoCode("4+5")).toBe(`4+5
console.log(4+5);`);
	});

	test("directed operation -", () => {
		expect(injectLogsIntoCode("4-5")).toBe(`4-5
console.log(4-5);`);
	});

	test("directed operation *", () => {
		expect(injectLogsIntoCode("4*5")).toBe(`4*5
console.log(4*5);`);
	});

	test("directed operation /", () => {
		expect(injectLogsIntoCode("4 / 5")).toBe(`4 / 5
console.log(4 / 5);`);
	});

	test("directed operation %", () => {
		expect(injectLogsIntoCode("4%5")).toBe(`4%5
console.log(4%5);`);
	});
	test("directed operation **", () => {
		expect(injectLogsIntoCode("4**5")).toBe(`4**5
console.log(4**5);`);
	});
	test("directed operation ===", () => {
		expect(injectLogsIntoCode("4===5")).toBe(`4===5
console.log(4===5);`);
	});

	test("directed operation !==", () => {
		expect(injectLogsIntoCode("4!==5")).toBe(`4!==5
console.log(4!==5);`);
	});

	test("directed operation >", () => {
		expect(injectLogsIntoCode("4>5")).toBe(`4>5
console.log(4>5);`);
	});

	test("directed operation <", () => {
		expect(injectLogsIntoCode("4<5")).toBe(`4<5
console.log(4<5);`);
	});

	test("directed operation >=", () => {
		expect(injectLogsIntoCode("4>=5")).toBe(`4>=5
console.log(4>=5);`);
	});

	test("directed operation <=", () => {
		expect(injectLogsIntoCode("4<=5")).toBe(`4<=5
console.log(4<=5);`);
	});
	test("directed operation &&", () => {
		expect(injectLogsIntoCode("true && false")).toBe(`true && false
console.log(true && false);`);
	});

	test("directed operation ||", () => {
		expect(injectLogsIntoCode("true || false")).toBe(`true || false
console.log(true || false);`);
	});

	test("directed operation ?", () => {
		expect(injectLogsIntoCode("true ? false : true")).toBe(`true ? false : true
console.log(true ? false : true);`);
	});
});

describe("addLogsToLines simbolos tests", () => {
	test("simbolos ())", () => {
		expect(injectLogsIntoCode("a(b)")).toBe(`a(b)
console.log(a(b));`);
		expect(injectLogsIntoCode("a(b,c,d)")).toBe(`a(b,c,d)
console.log(a(b,c,d));`);

		expect(injectLogsIntoCode(")")).toBe(")");
		expect(injectLogsIntoCode("(")).toBe("(");
	});
	test("simbolos (,)", () => {
		expect(injectLogsIntoCode("a(b,c)")).toBe(`a(b,c)
console.log(a(b,c));`);

		expect(injectLogsIntoCode(",")).toBe(",");
	});
	test("simbolos {}", () => {
		expect(injectLogsIntoCode("a{b}")).toBe(`a{b}
console.log(a{b});`);

		expect(injectLogsIntoCode("{")).toBe("{");
	});
	test("simbolos []", () => {
		expect(injectLogsIntoCode("a[b]")).toBe(`a[b]
console.log(a[b]);`);

		expect(injectLogsIntoCode("[")).toBe("[");
	});
});
