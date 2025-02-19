import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { Formatter } from "@/lib/formatter";
import type { ConsoleOutput } from "@/types/worker";
import * as Babel from "@babel/standalone";
// import type { PluginObj } from "@babel/core";

self.onmessage = async (event: MessageEvent) => {
	const { activeTabCode, name, injectLogs } = event.data;
	let output: ConsoleOutput[] = [];
	let outputLimitReached = false; // Bandera para limitar el output

	const sourceMap = new Map<number, { line: number; column: number }>();

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
		// Babel.registerPlugin("injectLogs", injectLogsPlugin);
		// console.log(activeTabCode, "activeTabCode");
		const transpiledCode = Babel.transform(activeTabCode, {
			presets: ["typescript"],
			filename: name ?? "code.ts",
			// plugins: ["injectLogs"],
			sourceType: "module",
			retainLines: true,
		}).code;

		// console.log(transpiledCode);
		const { code, lines } = injectLogsIntoCode(transpiledCode ?? "", {
			injectLogs: injectLogs,
		});
		// console.log(code);
		lines.forEach((line, index) => {
			sourceMap.set(index, { line, column: 0 });
		});
		let consolePosition = 0;

		self.console.clear = () => {
			output = [];
		};
		const log = (...args: unknown[]) => {
			if (!checkOutputLimit()) {
				const position = sourceMap.get(consolePosition);
				output.push({
					type: "log",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: position?.line || 0,
					column: position?.column || 0,
					timestamp: Date.now(),
				});
				consolePosition++;
			}
		};

		self.console.log = log;
		self.console.error = log;
		self.console.info = log;
		self.console.warn = log;

		if (!outputLimitReached) {
			new Function(code ?? "")();
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

// interface InjectLogsState {
//   logs: number[];
// }

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// function injectLogsPlugin({ types: t }: any): PluginObj<InjectLogsState> {
//   return {
//     visitor: {
//       Program: {
//         exit(_, state) {
//           // Inicializa la metadata para almacenar las líneas de log
//           if (!state.file.metadata.injectLogs) {
//             state.file.metadata.injectLogs = [];
//           }
//         },
//       },
//       ExpressionStatement(path, state) {
//         // Solo transformar si es top-level (su padre es Program)
//         if (!t.isProgram(path.parent)) return;

//         // Si ya es un console.log, registrar la línea y omitir
//         if (t.isCallExpression(path.node.expression)) {
//           const callExpr = path.node.expression;
//           if (
//             t.isMemberExpression(callExpr.callee) &&
//             t.isIdentifier(callExpr.callee.object, { name: "console" }) &&
//             t.isIdentifier(callExpr.callee.property, { name: "log" })
//           ) {
//             if (path.node.loc) {
//               state.file.metadata.injectLogs.push(path.node.loc.start.line);
//             }
//             return;
//           }
//         }

//         // Extraer la expresión original
//         const originalExpr = path.node.expression;
//         // Crear la llamada: console.log(originalExpr)
//         const logCall = t.callExpression(
//           t.memberExpression(t.identifier("console"), t.identifier("log")),
//           [originalExpr]
//         );
//         // Reemplazar el statement por el console.log(...)
//         path.replaceWith(t.expressionStatement(logCall));

//         if (path.node.loc) {
//           state.file.metadata.injectLogs.push(path.node.loc.start.line);
//         }
//       },
//     },
//   };
// }
