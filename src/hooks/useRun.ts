import { runCodeWorker } from "@/lib/runCode";
import { useEditorStore } from "@/store/editor";
import { useTabsStore } from "@/store/tabs";
import { useShallow } from "zustand/react/shallow";

export function useRun() {
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const updateTabLog = useTabsStore(useShallow((state) => state.updateTabLog));
	const setRunning = useEditorStore(useShallow((state) => state.setRunning));

	async function runCode() {
		if (!activeTab) return;
		if (!activeTab.code) {
			updateTabLog(activeTab.id, []);
		}
		const loading = setTimeout(() => {
			setRunning(true);
		}, 500);
		try {
			const name = activeTab?.name;
			const output = await runCodeWorker(activeTab.code, {
				name,
				injectLogs: true,
			});
			clearTimeout(loading);
			updateTabLog(activeTab.id, output);
		} catch (error) {
			updateTabLog(activeTab.id, [
				{
					type: "error",
					content: error instanceof Error ? error.message : "unknown error",
					line: 0,
					column: 0,
					timestamp: Date.now(),
				},
			]);
		} finally {
			clearTimeout(loading);
			setRunning(false);
		}
	}
	return { runCode };
}
