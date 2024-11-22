import type { ConsoleOutput } from "@/types/worker";
import ts from "typescript";

function Formatter<T>(item: T) {
	if (Array.isArray(item)) return `[ ${item.join(", ")} ]`;
	if (item !== null && typeof item === "object" && !Array.isArray(item)) {
		return Object.entries(item).reduce(
			(acc, [key, value]) =>
				`${acc}  ${key}: ${JSON.stringify(value, null, 2)}\n`,
			"",
		);
	}
	if (typeof item === "string") return `"${item}"`;

	return item;
}

self.onmessage = async (event: MessageEvent) => {
	const { activeTabCode } = event.data;
	const output: ConsoleOutput[] = [];
	let outputLimitReached = false; // Bandera para limitar el output

	const sourceMap = new Map<number, { line: number; column: number }>();
	let currentPosition = 0;
	const originalConsole = {
		log: self.console.log,
		error: self.console.error,
		info: self.console.info,
		warn: self.console.warn,
	};

	const checkOutputLimit = () => {
		if (output.length >= 4000) {
			if (!outputLimitReached) {
				output.push({
					type: "warn",
					content:
						"Output limit reached: No more logs will be recorded. max 4000",
					line: 0,
					column: 0,
					timestamp: Date.now(),
				});
				outputLimitReached = true;
			}
			self.postMessage(output); // Enviar resultado
			return true; // Indica que se alcanzó el límite
		}
		return false; // No se alcanzó el límite
	};

	try {
		const ts = await import("typescript");

		// Create source map for console calls
		const sourceFile = ts.createSourceFile(
			"code.ts",
			activeTabCode,
			ts.ScriptTarget.Latest,
			true,
		);

		const visitor = (node: ts.Node) => {
			if (
				ts.isCallExpression(node) &&
				ts.isPropertyAccessExpression(node.expression) &&
				ts.isIdentifier(node.expression.expression) &&
				node.expression.expression.text === "console"
			) {
				const { line, character } = sourceFile.getLineAndCharacterOfPosition(
					node.getStart(),
				);
				sourceMap.set(currentPosition++, {
					line: line + 1,
					column: character,
				});
			}
			ts.forEachChild(node, visitor);
		};
		ts.forEachChild(sourceFile, visitor);

		// Override console methods with output limit
		let consolePosition = 0;

		self.console.log = (...args) => {
			if (!checkOutputLimit()) {
				const position = sourceMap.get(consolePosition++);
				output.push({
					type: "log",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: position?.line || 0,
					column: position?.column || 0,
					timestamp: Date.now(),
				});
			}
		};

		self.console.error = (...args) => {
			if (!checkOutputLimit()) {
				const position = sourceMap.get(consolePosition++);
				output.push({
					type: "error",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: position?.line || 0,
					column: position?.column || 0,
					timestamp: Date.now(),
				});
			}
		};

		self.console.info = (...args) => {
			if (!checkOutputLimit()) {
				const position = sourceMap.get(consolePosition++);
				output.push({
					type: "info",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: position?.line || 0,
					column: position?.column || 0,
					timestamp: Date.now(),
				});
			}
		};

		self.console.warn = (...args) => {
			if (!checkOutputLimit()) {
				const position = sourceMap.get(consolePosition++);
				output.push({
					type: "warn",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: position?.line || 0,
					column: position?.column || 0,
					timestamp: Date.now(),
				});
			}
		};

		const result = ts.transpileModule(activeTabCode, {
			compilerOptions: {
				target: ts.ScriptTarget.ES2023,
				module: ts.ModuleKind.ESNext,
				strict: true,
			},
		});

		if (!outputLimitReached) {
			new Function(result.outputText)();
		}
	} catch (error) {
		if (!outputLimitReached) {
			output.push({
				type: "error",
				content: `Runtime Error: ${error ?? "Unknown error"}`,
				line: 0,
				column: 0,
				timestamp: Date.now(),
			});
		}
	} finally {
		// Restore original console methods
		self.console.log = originalConsole.log;
		self.console.error = originalConsole.error;
		self.console.info = originalConsole.info;
		self.console.warn = originalConsole.warn;

		if (!outputLimitReached) {
			self.postMessage(output); // Enviar resultado final
		}
	}
};
