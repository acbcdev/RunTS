import { ajuestLogs } from "@/lib/ajuestLogs";
import { runCodeWorker } from "@/lib/runCode";
import { useEditorStore } from "@/store/editor";
import { useTabsStore } from "@/store/tabs";
import { useShallow } from "zustand/react/shallow";

export function useRun() {
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	// const updateTabLog = useTabsStore(useShallow((state) => state.updateTabLog));
	const updateTabLogFormated = useTabsStore(
		useShallow((state) => state.updateTabLogFormated),
	);

	const setRunning = useEditorStore(useShallow((state) => state.setRunning));
	const expression = useEditorStore(useShallow((state) => state.expression));
	const alignLogs = useEditorStore(useShallow((state) => state.alignLogs));

	async function runCode() {
		if (!activeTab) return;
		if (!activeTab.code) {
			updateTabLogFormated(activeTab.id, "");
		}
		const loading = setTimeout(() => {
			setRunning(true);
		}, 500);
		try {
			const name = activeTab?.name;
			const output = await runCodeWorker(activeTab.code, {
				name,
				injectLogs: expression,
			});
			clearTimeout(loading);
			const logs = alignLogs
				? ajuestLogs(output)
				: output.map(({ content }) => content).join("\n");
			updateTabLogFormated(activeTab.id, logs);
		} catch (error) {
			updateTabLogFormated(activeTab.id, String(error));
		} finally {
			clearTimeout(loading);
			setRunning(false);
		}
	}
	return { runCode };
}
