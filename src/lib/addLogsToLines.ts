import { parse, type ExpressionStatement } from "acorn";
import { ancestor } from "acorn-walk";

type InjectLogsIntoCodeOptions = {
	injectLogs: boolean;
};

type ReplacementPoint = {
	start: number;
	end: number;
	expr: string;
	line: number;
};

export function injectLogsIntoCode(
	code: string,
	options?: InjectLogsIntoCodeOptions,
): { code: string; lines: number[] } {
	const logLines: number[] = [];
	let newCode = code;

	try {
		const ast = parse(code, {
			ecmaVersion: "latest",
			sourceType: "module",
			locations: true,
			ranges: true,
		});

		const replacements: ReplacementPoint[] = [];

		ancestor(ast, {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			ExpressionStatement(node, ancestors: any[]) {
				if (!node.loc) return;
				// Solo transformar statements de nivel superior.
				const parent = ancestors[ancestors.length - 2];
				if (parent && parent.type !== "Program") return;

				// Evitar transformar si ya es un console.log
				if (isConsoleLogCall(node.expression)) {
					logLines.push(node.loc.start.line);
					return;
				}

				let exprText = code.slice(node.start, node.end).trim();
				if (exprText.endsWith(";")) {
					exprText = exprText.slice(0, -1);
				}
				// Colapsar expresiones multilínea en una sola línea.
				exprText = exprText.replace(/\n\s*/g, " ");

				replacements.push({
					start: node.start,
					end: node.end,
					expr: exprText.trim(),
					line: node.loc.start.line,
				});
				logLines.push(node.loc.start.line);
			},
		});

		// Reemplazar de atrás hacia adelante.
		replacements.sort((a, b) => b.start - a.start);
		if (options?.injectLogs) {
			for (const { start, end, expr } of replacements) {
				newCode = `${newCode.slice(
					0,
					start,
				)}console.log(${expr})${newCode.slice(end)}`.trim();
			}
		}
	} catch (error) {
		console.error("Error al parsear el código:", error);
	}

	return { code: newCode, lines: logLines };
}

function isConsoleLogCall(
	expression: ExpressionStatement["expression"],
): boolean {
	if (expression.type !== "CallExpression") return false;
	const callExpr = expression;
	const callee = callExpr.callee;
	return (
		callee &&
		callee.type === "MemberExpression" &&
		callee.object?.type === "Identifier" &&
		callee.object.name === "console" &&
		callee.property?.type === "Identifier" &&
		callee.property.name === "log"
	);
}
