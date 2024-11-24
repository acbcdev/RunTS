import { transformSync } from "@swc/wasm-web";
import type { ConsoleOutput } from "@/types/worker";
import { Formatter } from "./formatter";

const addLoopProtection = `
let __loopCounter = 0;
const __maxIterations = 1000;

function checkInfiniteLoop() {
  __loopCounter++;
  if (__loopCounter > __maxIterations) {
    throw new Error("Infinite loop detected.");
  }
}
`;

// Escuchar mensajes en el worker
export async function runCode(code: string): Promise<ConsoleOutput[]> {
	const output: ConsoleOutput[] = [];
	let outputLimitReached = false;

	const originalConsole = {
		log: console.log,
		error: console.error,
		info: console.info,
		warn: console.warn,
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
			postMessage(output);
			return true;
		}
		return false;
	};

	try {
		// Instrumentar código con SWC para proteger bucles
		const transformedCode = transformSync(code, {
			jsc: {
				parser: {
					syntax: "typescript", // Usa "typescript" si es TypeScript
				},
				target: "es2022",
			},
		}).code;

		// Combinar código instrumentado con protección inicial
		const finalCode = `${addLoopProtection}\n${transformedCode}`;

		console.log = (...args) => {
			if (!checkOutputLimit()) {
				output.push({
					type: "log",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: 0,
					column: 0,
					timestamp: Date.now(),
				});
			}
		};
		console.info = (...args) => {
			if (!checkOutputLimit()) {
				output.push({
					type: "log",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: 0,
					column: 0,
					timestamp: Date.now(),
				});
			}
		};
		console.warn = (...args) => {
			if (!checkOutputLimit()) {
				output.push({
					type: "log",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: 0,
					column: 0,
					timestamp: Date.now(),
				});
			}
		};
		console.error = (...args) => {
			if (!checkOutputLimit()) {
				output.push({
					type: "error",
					content: args.map((arg) => Formatter(arg)).join(" "),
					line: 0,
					column: 0,
					timestamp: Date.now(),
				});
			}
		};

		// Ejecutar código transformado
		if (!outputLimitReached) {
			new Function(finalCode)();
		}
		return output;
	} catch (error) {
		return [
			{
				type: "error",
				content: `Runtime Error: ${error ?? "Unknown error"}`,
				line: 0,
				column: 0,
				timestamp: Date.now(),
			},
		];
	} finally {
		console.log = originalConsole.log;
		console.error = originalConsole.error;
		console.info = originalConsole.info;
		console.warn = originalConsole.warn;
	}
}
