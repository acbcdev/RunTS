import { useTabsStore } from "../src/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../src/features/editor/editor-store";
import { runCodeWorker } from "../src/features/editor/run-code/runCode";
import { runTab } from "../src/features/editor/run-code/runTab";
import { runCode } from "../src/features/editor/use-run/useRun";

const result = document.querySelector("#result")!;
const options = { injectLogs: false, alignLogs: false };
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
function check(condition: unknown, message: string) {
	if (!condition) throw new Error(message);
}

async function test() {
	const tsOutput = await runTab({ name: "a.ts", code: 'const n: number = 2; console.log(n)' }, options);
	check(tsOutput === "2", `TypeScript output: ${tsOutput}`);
	check(await runTab({ name: "a.js", code: 'console.log(3)' }, options) === "3", "JavaScript output");
	const aligned = await runTab({ name: "a.ts", code: '\nconsole.log(4)' }, { ...options, alignLogs: true });
	check(aligned === "\n\n4", `Aligned output: ${JSON.stringify(aligned)}`);
	check((await runTab({ name: "a.ts", code: 'throw new Error("oops")' }, options))?.includes("oops"), "Runtime error");
	check(await runTab({ name: "a.md", code: "ignored" }, options) === null, "Language gate");
	try {
		await runCodeWorker("while (true) {}", { timeoutWorker: 100 });
		throw new Error("Timeout did not reject");
	} catch (error) {
		check(String(error).includes("tiempo de espera"), "Timeout error");
	}
	useTabsStore.setState({ tabs: [], activeTabId: "", activeTabHistory: [] });
	useEditorStore.getState().updateEditor({ expression: false, alignLogs: false });
	useTabsStore.getState().newTab({ name: "race.js", code: 'setTimeout(() => console.log(1), 900)' });
	const id = useTabsStore.getState().activeTabId;
	const old = runCode();
	useTabsStore.getState().updateTab(id, { code: 'setTimeout(() => console.log(2), 600)' });
	const recent = runCode();
	await delay(550);
	check(useEditorStore.getState().running, "Latest run should be running");
	await recent;
	await old;
	check(useTabsStore.getState().getTab(id)?.log === "2", "Old result replaced latest output");
	check(!useEditorStore.getState().running, "Indicator remained active");
	useTabsStore.getState().updateTab(id, { code: 'setTimeout(() => console.log("stale"), 300)' });
	const pending = runCode();
	useTabsStore.getState().updateTab(id, { name: "race.md" });
	await pending;
	check(useTabsStore.getState().getTab(id)?.log === "2", "Renamed tab received stale result");
	result.textContent = "PASS: real Worker Execute integration";
}

test().catch((error) => { result.textContent = `FAIL: ${error.stack || error}`; });
