import { langFromName } from "../language/langFromName";
import { alignLogLines } from "./alignLogLines";
import { runCodeWorker } from "./runCode";

type RunOptions = { injectLogs: boolean; alignLogs: boolean };

/**
 * The single Execute seam: language gate, worker run and log formatting.
 * Returns the tab's new log text, or null when the tab's language can't run.
 * Never throws — worker failures become the log text.
 */
export async function runTab(
	tab: { name?: string; code: string },
	{ injectLogs, alignLogs }: RunOptions,
	spawn = runCodeWorker,
): Promise<string | null> {
	if (!langFromName(tab.name).execute) return null;
	try {
		const output = await spawn(tab.code, { name: tab.name, injectLogs });
		return alignLogs
			? alignLogLines(output)
			: output.map(({ content }) => content).join("\n");
	} catch (error) {
		return String(error);
	}
}
