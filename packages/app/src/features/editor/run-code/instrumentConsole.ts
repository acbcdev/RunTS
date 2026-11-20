import { parse } from "acorn";
import { simple } from "acorn-walk";

/** Capture locations at the call site; WebKit omits eval locations in stacks. */
export function instrumentConsole(code: string) {
	let binding = "__runtsConsoleAt";
	while (code.includes(binding)) binding += "_";
	const edits: { start: number; end: number; line: number; column: number }[] =
		[];
	simple(
		parse(code, {
			ecmaVersion: "latest",
			sourceType: "module",
			locations: true,
		}),
		{
			MemberExpression(node) {
				const object = node.object;
				const isConsole =
					object.type === "Identifier" && object.name === "console";
				const isWorkerConsole =
					object.type === "MemberExpression" &&
					object.object.type === "Identifier" &&
					["self", "globalThis"].includes(object.object.name) &&
					object.property.type === "Identifier" &&
					object.property.name === "console";
				if ((isConsole || isWorkerConsole) && node.loc)
					edits.push({
						start: object.start,
						end: object.end,
						line: node.loc.start.line,
						column: node.loc.start.column,
					});
			},
		},
	);
	for (const { start, end, line, column } of edits.sort(
		(a, b) => b.start - a.start,
	)) {
		code = `${code.slice(0, start)}${binding}(${code.slice(start, end)}, ${line}, ${column})${code.slice(end)}`;
	}
	return { code, binding };
}
