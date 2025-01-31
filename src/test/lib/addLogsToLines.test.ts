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
`).code,
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
`).code,
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
`).code,
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

`).code,
		).toBe(`let a = 1;
a = 54
a
console.log(a);`);
	});

	test("simple let declaration with ;", () => {
		expect(
			injectLogsIntoCode(`let a = 1;
a = 54;
a`).code,
		).toBe(`let a = 1;
a = 54;
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
`).code,
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
	`).code,
		).toBe(`function helloTo(name) {
	return 'hello ' + name;
}
	helloTo('world')
console.log(helloTo('world'));`);
	});
});

describe("operation tests", () => {
	test("directed operation +", () => {
		expect(injectLogsIntoCode("4+5").code).toBe(`4+5
console.log(4+5);`);
	});

	test("directed operation -", () => {
		expect(injectLogsIntoCode("4-5").code).toBe(`4-5
console.log(4-5);`);
	});

	test("directed operation *", () => {
		expect(injectLogsIntoCode("4*5").code).toBe(`4*5
console.log(4*5);`);
	});

	test("directed operation /", () => {
		expect(injectLogsIntoCode("4 / 5").code).toBe(`4 / 5
console.log(4 / 5);`);
	});

	test("directed operation %", () => {
		expect(injectLogsIntoCode("4%5").code).toBe(`4%5
console.log(4%5);`);
	});
	test("directed operation **", () => {
		expect(injectLogsIntoCode("4**5").code).toBe(`4**5
console.log(4**5);`);
	});
	test("directed operation ===", () => {
		expect(injectLogsIntoCode("4===5").code).toBe(`4===5
console.log(4===5);`);
	});

	test("directed operation !==", () => {
		expect(injectLogsIntoCode("4!==5").code).toBe(`4!==5
console.log(4!==5);`);
	});

	test("directed operation >", () => {
		expect(injectLogsIntoCode("4>5").code).toBe(`4>5
console.log(4>5);`);
	});

	test("directed operation <", () => {
		expect(injectLogsIntoCode("4<5").code).toBe(`4<5
console.log(4<5);`);
	});

	test("directed operation >=", () => {
		expect(injectLogsIntoCode("4>=5").code).toBe(`4>=5
console.log(4>=5);`);
	});

	test("directed operation <=", () => {
		expect(injectLogsIntoCode("4<=5").code).toBe(`4<=5
console.log(4<=5);`);
	});
	test("directed operation &&", () => {
		expect(injectLogsIntoCode("true && false").code).toBe(`true && false
console.log(true && false);`);
	});

	test("directed operation ||", () => {
		expect(injectLogsIntoCode("true || false").code).toBe(`true || false
console.log(true || false);`);
	});

	test("directed operation ?", () => {
		expect(
			injectLogsIntoCode("true ? false : true").code,
		).toBe(`true ? false : true
console.log(true ? false : true);`);
	});
});

describe("simbolos tests", () => {
	test("simbolos ())", () => {
		expect(injectLogsIntoCode("a(b)").code).toBe(`a(b)
console.log(a(b));`);
		expect(injectLogsIntoCode("a(b,c,d)").code).toBe(`a(b,c,d)
console.log(a(b,c,d));`);

		expect(injectLogsIntoCode(")").code).toBe(")");
		expect(injectLogsIntoCode("(").code).toBe("(");
	});

	test("simbolos (,)", () => {
		expect(injectLogsIntoCode("a(b,c)").code).toBe(`a(b,c)
console.log(a(b,c));`);

		expect(injectLogsIntoCode(",").code).toBe(",");
	});

	test("simbolos {}", () => {
		expect(injectLogsIntoCode("a{b}").code).toBe("a{b}");

		expect(injectLogsIntoCode("{").code).toBe("{");
	});

	test("simbolos []", () => {
		expect(injectLogsIntoCode("a[b]").code).toBe(`a[b]
console.log(a[b]);`);

		expect(injectLogsIntoCode("[").code).toBe("[");
	});
});

describe("comment tests", () => {
	test("simple comment", () => {
		expect(injectLogsIntoCode("// hello").code).toBe("// hello");
	});

	test("comment with code", () => {
		expect(injectLogsIntoCode("// hello\n// world").code).toBe(
			"// hello\n// world",
		);
	});

	test("comment with code and code", () => {
		expect(injectLogsIntoCode("// hello\n// world\n// code").code).toBe(
			"// hello\n// world\n// code",
		);
	});
});
describe("multiline tests", () => {
	test("multiline", () => {
		expect(injectLogsIntoCode("a\nb").code).toBe(`a
console.log(a);
b
console.log(b);`);
	});
});

describe("function tests", () => {
	test("simple function", () => {
		expect(
			injectLogsIntoCode("function a() {\n\tconsole.log('a');\n}").code,
		).toBe(`function a() {
	console.log('a');
}`);
	});
	test("simple function with multiple lines", () => {
		expect(
			injectLogsIntoCode(
				"function helloTo(name) {\n\treturn 'hello ' + name;\n}\nhelloTo('world')",
			).code,
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
			).code,
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
			).code,
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
}`).code,
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
}`).code,
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
}`).code,
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
}`).code,
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
}`).code,
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}`);
	});

	test("simple for with multiple lines", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	console.log(i);
}
`).code,
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}`);
	});

	test("simple for with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	console.log(i);
}	// comentario
`).code,
		).toBe(`for (let i = 0; i < 10; i++) {
	console.log(i);
}	// comentario`);
	});

	test("simple for with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`for (let i = 0; i < 10; i++) {
	i
}	// comentario
`).code,
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
}					`).code,
		).toBe(`while (true) {
	console.log('true');
}`);
	});
	test("simple while with multiple lines", () => {
		expect(
			injectLogsIntoCode(`while (true) {
	console.log('true');
}
`).code,
		).toBe(`while (true) {
	console.log('true');
}`);
	});
	test("simple while with multiple lines and comments", () => {
		expect(
			injectLogsIntoCode(`while (true) {
	console.log('true');
}	// comentario
`).code,
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
}`).code,
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
}`).code,
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
}`).code,
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
}`).code,
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
a + b;`).code,
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
}`).code,
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
}`).code,
		).toBe(`let i = 0;
while (i < 10) {
	if (i === 5) {
		break;
	}
	i++;
}`);
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
}`).code,
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
}`).code,
		).toBe(`let i = 0;
while (i < 10) {
	i++;
	if (i % 2 === 0) {
		continue;
	}
	console.log(i);
}`);
	});
});

describe("JavaSript API", () => {
	test("Array", () => {
		expect(injectLogsIntoCode("const a = [1, 2, 3];").code).toBe(
			"const a = [1, 2, 3];",
		);

		expect(
			injectLogsIntoCode("const a = Array(100);\na[0] = 10;").code,
		).toBe(`const a = Array(100);
a[0] = 10;`);

		expect(
			injectLogsIntoCode(`const limit = 15;
let count = 1;
Array(limit)
	.fill(0)
	.reduce((acc, _, index) => {
		const spaces = " ".repeat(Math.abs(limit - count) / 2);
		const stars = "*".repeat(count) + "\n";
		index >= Math.floor(limit / 2) ? (count -= 2) : (count += 2);
		return acc + spaces + stars;
	}, "");`).code,
		).toBe(`const limit = 15;
let count = 1;
Array(limit)
	.fill(0)
	.reduce((acc, _, index) => {
		const spaces = " ".repeat(Math.abs(limit - count) / 2);
		const stars = "*".repeat(count) + "\n";
		index >= Math.floor(limit / 2) ? (count -= 2) : (count += 2);
		return acc + spaces + stars;
	}, "");`);
	});
});

describe("array with methods", () => {
	test("simple array", () => {
		expect(injectLogsIntoCode("const a = [1, 2, 3];").code).toBe(
			"const a = [1, 2, 3];",
		);
		expect(injectLogsIntoCode("const a = Array(100);\na[0] = 10;").code).toBe(
			"const a = Array(100);\na[0] = 10;",
		);
	});

	test("array with methods", () => {
		expect(injectLogsIntoCode("[1, 2, 3, 4].map(num => num * 2);").code).toBe(
			"[1, 2, 3, 4].map(num => num * 2);\nconsole.log([1, 2, 3, 4].map(num => num * 2));",
		);
	});
});
