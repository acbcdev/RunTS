import { type Expression, type ExpressionStatement, parse } from "acorn";
import { ancestor, simple } from "acorn-walk";

type InjectLogsIntoCodeOptions = {
	injectLogs: boolean;
};

type ReplacementPoint = {
	start: number;
	end: number;
	expr: string;
	line: number;
	type: Expression["type"];
};

function countLines(str: string): number {
	return str.split("\n").length;
}

export function injectLogsIntoCode(
	code: string,
	options: InjectLogsIntoCodeOptions = { injectLogs: false },
): { code: string; lines: number[] } {
	const numsOfToTrim = countLines(code);
	const trimmedCode = code.trim();
	const diference = numsOfToTrim - countLines(trimmedCode);

	const logLines: number[] = [];

	if (!options.injectLogs) {
		try {
			const ast = parse(code, {
				ecmaVersion: "latest",
				sourceType: "module",
				locations: true,
			});
			simple(ast, {
				ExpressionStatement(node) {
					if (node.loc && isConsoleLogCall(node.expression)) {
						logLines.push(node.loc.start.line + diference);
					}
				},
			});
		} catch {
			// Ignore parsing errors if we're just counting logs
		}
		return { code, lines: logLines };
	}

	try {
		const ast = parse(trimmedCode, {
			ecmaVersion: "latest",
			sourceType: "module",
			locations: true,
			ranges: true,
		});

		const replacements: ReplacementPoint[] = [];

		ancestor(ast, {
			ExpressionStatement(node, _, ancestors) {
				if (!node.loc || !node.range) return;

				const parent = ancestors[ancestors.length - 2];
				if (parent && parent.type !== "Program") return;

				if (isConsoleLogCall(node.expression)) {
					logLines.push(node.loc.start.line);
					return;
				}

				const [start, end] = node.expression.range ?? [];
				const exprText = trimmedCode.slice(start, end);

				replacements.push({
					start: node.range[0],
					end: node.range[1],
					expr: exprText,
					line: node.loc.start.line,
					type: node.expression.type,
				});
				logLines.push(node.loc.start.line + diference);
			},
		});

		let newCode = trimmedCode;
		replacements.sort((a, b) => b.start - a.start);

		for (const { start, end, expr, type } of replacements) {
			let finalExpr = expr.replace(/\s*\n\s*/g, " ");
			if (type === "ObjectExpression") {
				finalExpr = `(${finalExpr})`;
			}

			const originalStatement = trimmedCode.slice(start, end);
			const hasSemicolon = originalStatement.trim().endsWith(";");

			const replacementText = `console.log(${finalExpr})${
				hasSemicolon ? ";" : ""
			}`;
			newCode = newCode.slice(0, start) + replacementText + newCode.slice(end);
		}

		return { code: newCode, lines: logLines.sort((a, b) => a - b) };
	} catch (error) {
		console.error("Error parsing or transforming code:", error);
		return { code: trimmedCode, lines: logLines };
	}
}

function isConsoleLogCall(
	expression: ExpressionStatement["expression"],
): boolean {
	if (expression.type !== "CallExpression") return false;

	const callee = expression.callee;
	return (
		callee.type === "MemberExpression" &&
		callee.object.type === "Identifier" &&
		callee.object.name === "console" &&
		callee.property.type === "Identifier" &&
		callee.property.name === "log"
	);
}
