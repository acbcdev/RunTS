import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { describe, expect, test } from "vitest";
// js apis like  Array.from()
describe("declaration tests", () => {
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
a = 54
a

`),
		).toBe(`let a = 1;
a = 54
console.log(a = 54);
a
console.log(a);`);
	});

	test("simple let declaration with ;", () => {
		expect(
			injectLogsIntoCode(`let a = 1;
a = 54;
a`),
		).toBe(`let a = 1;
a = 54;
console.log(a = 54);
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

describe("operation tests", () => {
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

describe("simbolos tests", () => {
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
		expect(injectLogsIntoCode("a{b}")).toBe("a{b}");

		expect(injectLogsIntoCode("{")).toBe("{");
	});

	test("simbolos []", () => {
		expect(injectLogsIntoCode("a[b]")).toBe(`a[b]
console.log(a[b]);`);

		expect(injectLogsIntoCode("[")).toBe("[");
	});
});

describe("comment tests", () => {
	test("simple comment", () => {
		expect(injectLogsIntoCode("// hello")).toBe("// hello");
	});

	test("comment with code", () => {
		expect(injectLogsIntoCode("// hello\n// world")).toBe("// hello\n// world");
	});

	test("comment with code and code", () => {
		expect(injectLogsIntoCode("// hello\n// world\n// code")).toBe(
			"// hello\n// world\n// code",
		);
	});
});
describe("multiline tests", () => {
	test("multiline", () => {
		expect(injectLogsIntoCode("a\nb")).toBe(`a
console.log(a);
b
console.log(b);`);
	});
});

describe("function tests", () => {
	test("simple function", () => {
		expect(
			injectLogsIntoCode("function a() {\n\tconsole.log('a');\n}"),
		).toBe(`function a() {
	console.log('a');
}`);
	});
	test("simple function with multiple lines", () => {
		expect(
			injectLogsIntoCode(
				"function helloTo(name) {\n\treturn 'hello ' + name;\n}\nhelloTo('world')",
			),
		).toBe(`function helloTo(name) {
	return 'hello ' + name;
}
helloTo('world')
console.log(helloTo('world'));`);
	});

	test("simple function with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(
				"function helloTo(name) {\n\t// comentario\n\treturn 'hello ' + name;\n}\nhelloTo('world')",
			),
		).toBe(`function helloTo(name) {
	// comentario
	return 'hello ' + name;
}
helloTo('world')
console.log(helloTo('world'));`);
	});

	test("is Anagrama", () => {
		expect(
			injectLogsIntoCode(
				`const isAnagram = (str1, str2) => {
  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '')
      .split('')
      .sort()
      .join('');
  return normalize(str1) === normalize(str2);
};

isAnagram('iceman', 'cinema');`,
			),
		).toBe(
			`const isAnagram = (str1, str2) => {
  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '')
      .split('')
      .sort()
      .join('');
  return normalize(str1) === normalize(str2);
};

isAnagram('iceman', 'cinema');
console.log(isAnagram('iceman', 'cinema'));`,
		);
	});
});

describe("if tests", () => {
	test("simple if", () => {
		expect(
			injectLogsIntoCode(`if (true) {
	console.log('true');
}`),
		).toBe(`if (true) {
	console.log('true');
}`);
	});

	test("simple if with else", () => {
		expect(
			injectLogsIntoCode(`if (true) {
	console.log('true');
} else {
	console.log('false');
}`),
		).toBe(`if (true) {
	console.log('true');
} else {
	console.log('false');
}`);
	});

	test("simple if with else and multiple lines", () => {
		expect(
			injectLogsIntoCode(`if (true) {
	console.log('true');
}
else {
	console.log('false');
}`),
		).toBe(`if (true) {
	console.log('true');
}
else {
	console.log('false');
}`);
	});
	test("simple if else ", () => {
		expect(
			injectLogsIntoCode(`if (true) {
	console.log('true');
}if else (false) {
	console.log('false');
}`),
		).toBe(`if (true) {
	console.log('true');
}if else (false) {
	console.log('false');
}`);
	});
});

describe("for tests", () => {
	test("simple for", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	console.log(i);
}`),
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}`);
	});

	test("simple for with multiple lines", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	console.log(i);
}
`),
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}`);
	});

	test("simple for with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	console.log(i);
}	// comentario
`),
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}	// comentario`);
	});

	test("simple for with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	i
}	// comentario
`),
		).toBe(`for (let i = 0; i < 10; i++) {
	i
}	// comentario`);
	});
});
describe("while tests", () => {
	test("simple while", () => {
		expect(
			injectLogsIntoCode(`while (true) {
	console.log('true');
}					`),
		).toBe(`while (true) {
	console.log('true');
}`);
	});
	test("simple while with multiple lines", () => {
		expect(
			injectLogsIntoCode(`while (true) {
	console.log('true');
}
`),
		).toBe(`while (true) {
	console.log('true');
}`);
	});
	test("simple while with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`while (true) {
	console.log('true');
}	// comentario
`),
		).toBe(`while (true) {
	console.log('true');
}	// comentario`);
	});
});

describe("try-catch tests", () => {
	test("simple try-catch", () => {
		expect(
			injectLogsIntoCode(`try {
	console.log("try block");
} catch (e) {
	console.log("catch block");
}`),
		).toBe(`try {
	console.log("try block");
} catch (e) {
	console.log("catch block");
}`);
	});

	test("try-catch with finally", () => {
		expect(
			injectLogsIntoCode(`try {
	console.log("try block");
} catch (e) {
	console.log("catch block");
} finally {
	console.log("finally block");
}`),
		).toBe(`try {
	console.log("try block");
} catch (e) {
	console.log("catch block");
} finally {
	console.log("finally block");
}`);
	});

	test("try-catch with operations", () => {
		expect(
			injectLogsIntoCode(`try {
	let a = 5;
	a + 10;
} catch (e) {
	console.log("error");
}`),
		).toBe(`try {
	let a = 5;
	a + 10;
} catch (e) {
	console.log("error");
}`);
	});
});

describe("switch tests", () => {
	test("simple switch statement", () => {
		expect(
			injectLogsIntoCode(`switch (x) {
	case 1:
		const a = 10;
		break;
	case 2:
		console.log("case 2");
		break;
	default:
		console.log("default");
}`),
		).toBe(`switch (x) {
	case 1:
		const a = 10;
		break;
	case 2:
		console.log("case 2");
		break;
	default:
		console.log("default");
}`);
	});

	test("switch with operations outside", () => {
		expect(
			injectLogsIntoCode(`switch (x) {
	case 1:
		const a = 10;
		break;
	case 2:
		const b = 20;
		break;
	default:
		console.log("default");
}
a + b;`),
		).toBe(`switch (x) {
	case 1:
		const a = 10;
		break;
	case 2:
		const b = 20;
		break;
	default:
		console.log("default");
}
a + b;
console.log(a + b);`);
	});
});

describe("break tests", () => {
	test("for loop with break", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	if (i === 5) {
		break;
	}
	console.log(i);
}`),
		).toBe(`for (let i = 0; i < 10; i++) {
	if (i === 5) {
		break;
	}
	console.log(i);
}`);
	});

	test("while loop with break", () => {
		expect(
			injectLogsIntoCode(`let i = 0;
while (i < 10) {
	if (i === 5) {
		break;
	}
	i++;
}`),
		).toBe(`let i = 0;
while (i < 10) {
	if (i === 5) {
		break;
	}
	i++;
}`);
	});

	test("break outside loops", () => {
		expect(
			injectLogsIntoCode(`break;
a + b;`),
		).toBe(`break;
a + b;
console.log(a + b);`);
	});
});

describe("continue tests", () => {
	test("for loop with continue", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	if (i % 2 === 0) {
		continue;
	}
	console.log(i);
}`),
		).toBe(`for (let i = 0; i < 10; i++) {
	if (i % 2 === 0) {
		continue;
	}
	console.log(i);
}`);
	});

	test("while loop with continue", () => {
		expect(
			injectLogsIntoCode(`let i = 0;
while (i < 10) {
	i++;
	if (i % 2 === 0) {
		continue;
	}
	console.log(i);
}`),
		).toBe(`let i = 0;
while (i < 10) {
	i++;
	if (i % 2 === 0) {
		continue;
	}
	console.log(i);
}`);
	});

	test("continue outside loops", () => {
		expect(
			injectLogsIntoCode(`continue;
a + b;`),
		).toBe(`continue;
a + b;
console.log(a + b);`);
	});
});

describe("JavaSript API", () => {
	test("Array", () => {});
});
