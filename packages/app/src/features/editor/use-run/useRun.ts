import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../editor-store";
import { langFromName } from "../language/langFromName";
import { runTab } from "../run-code";

const latestRuns = new Map<string, object>();
let indicatorRun: object | undefined;

export async function runCode() {
	const tab = useTabsStore.getState().getCurrentTab();
	if (!tab) return;
	const run = {};
	latestRuns.set(tab.id, run);
	indicatorRun = run;
	useEditorStore.getState().updateEditor({ running: false });
	let valid = true;
	const unsubscribe = useTabsStore.subscribe((state) => {
		const current = state.getTab(tab.id);
		if (valid && (!current || !langFromName(current.name).execute)) {
			valid = false;
			if (indicatorRun === run) {
				indicatorRun = undefined;
				useEditorStore.getState().updateEditor({ running: false });
			}
		}
	});
	const loading = setTimeout(() => {
		if (valid && indicatorRun === run) {
			useEditorStore.getState().updateEditor({ running: true });
		}
	}, 500);
	try {
		const { expression: injectLogs, alignLogs } = useEditorStore.getState();
		const result = await runTab(tab, { injectLogs, alignLogs });
		if (
			valid &&
			latestRuns.get(tab.id) === run &&
			result !== null &&
			useTabsStore.getState().getTab(tab.id)?.code === tab.code
		) {
			useTabsStore.getState().updateTab(tab.id, result);
		}
	} finally {
		unsubscribe();
		clearTimeout(loading);
		if (latestRuns.get(tab.id) === run) latestRuns.delete(tab.id);
		if (indicatorRun === run) {
			indicatorRun = undefined;
			useEditorStore.getState().updateEditor({ running: false });
		}
	}
}

export function useRun() {
	return { runCode };
}
