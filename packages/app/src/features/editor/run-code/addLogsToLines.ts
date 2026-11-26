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

export function injectLogsIntoCode(
	code: string,
	options: InjectLogsIntoCodeOptions = { injectLogs: false },
): { code: string; lines: number[] } {
	if (!code.trim()) return { code: "", lines: [] };

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
					if (node.loc && isConsoleCall(node.expression)) {
						logLines.push(node.loc.start.line);
					}
				},
			});
		} catch {
			// Ignore parsing errors if we're just counting logs
		}
		return { code, lines: logLines };
	}

	try {
		const ast = parse(code, {
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

				if (isConsoleCall(node.expression)) {
					logLines.push(node.loc.start.line);
					return;
				}

				const [start, end] = node.expression.range ?? [];
				const exprText = code.slice(start, end);

				replacements.push({
					start: node.range[0],
					end: node.range[1],
					expr: exprText,
					line: node.loc.start.line,
					type: node.expression.type,
				});
				logLines.push(node.loc.start.line);
			},
		});

		let newCode = code;
		replacements.sort((a, b) => b.start - a.start);

		for (const { start, end, expr, type } of replacements) {
			let finalExpr = expr;
			if (type === "ObjectExpression") {
				finalExpr = `(${finalExpr})`;
			}

			const originalStatement = code.slice(start, end);
			const hasSemicolon = originalStatement.trim().endsWith(";");

			// Calls returning undefined (forEach, void fns) would log a stray "undefined"
			const replacementText =
				type === "CallExpression"
					? `((__v) => __v !== undefined && console.log(__v))(${finalExpr})${hasSemicolon ? ";" : ""}`
					: `console.log(${finalExpr})${hasSemicolon ? ";" : ""}`;
			newCode = newCode.slice(0, start) + replacementText + newCode.slice(end);
		}

		return { code: newCode, lines: logLines.sort((a, b) => a - b) };
	} catch (error) {
		console.error("Error parsing or transforming code:", error);
		return { code, lines: logLines };
	}
}

function isConsoleCall(expression: ExpressionStatement["expression"]): boolean {
	if (expression.type !== "CallExpression") return false;

	const callee = expression.callee;
	if (callee.type !== "MemberExpression") return false;
	const target = callee.object;
	return (
		(target.type === "Identifier" && target.name === "console") ||
		(target.type === "MemberExpression" &&
			target.object.type === "Identifier" &&
			["self", "globalThis"].includes(target.object.name) &&
			target.property.type === "Identifier" &&
			target.property.name === "console")
	);
}
