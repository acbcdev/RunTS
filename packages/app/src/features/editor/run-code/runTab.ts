import { langFromName } from "../language/langFromName";
import { alignLogLines } from "./alignLogLines";
import { captureConsole } from "./captureConsole";
import { runCodeWorker } from "./runCode";
import type { ConsoleOutput } from "./types";

type RunOptions = { injectLogs: boolean; alignLogs: boolean };

/**
 * The single Execute seam: language gate, worker run and log formatting.
 * Returns formatted text and structured events, or null for other languages.
 * Never throws — worker failures become the log text.
 */
export async function runTab(
	tab: { name?: string; code: string },
	{ injectLogs, alignLogs }: RunOptions,
	spawn = runCodeWorker,
): Promise<{ log: string; consoleOutput: ConsoleOutput[] } | null> {
	if (!langFromName(tab.name).execute) return null;
	try {
		const output = await spawn(tab.code, { name: tab.name, injectLogs });
		return {
			log: alignLogs
				? alignLogLines(output)
				: output.map(({ content }) => content).join("\n"),
			consoleOutput: output,
		};
	} catch (error) {
		const capture = captureConsole();
		capture.reportError(error);
		return { log: String(error), consoleOutput: capture.getOutput() };
	}
}
