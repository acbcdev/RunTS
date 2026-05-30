import { useShallow } from "zustand/react/shallow";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../editor-store";
import { runCodeWorker } from "../run-code";
import { ajuestLogs } from "./ajuestLogs";

export function useRun() {
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const updateTab = useTabsStore(useShallow((state) => state.updateTab));

	const updateEditor = useEditorStore(
		useShallow((state) => state.updateEditor),
	);
	const expression = useEditorStore(useShallow((state) => state.expression));
	const alignLogs = useEditorStore(useShallow((state) => state.alignLogs));

	async function runCode() {
		if (!activeTab) return;
		if (activeTab.code.trim() === "") {
			updateTab(activeTab.id, { log: "" });
		}
		const loading = setTimeout(() => {
			updateEditor({ running: true });
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
			updateTab(activeTab.id, { log: logs });
		} catch (error) {
			updateTab(activeTab.id, { log: String(error) });
		} finally {
			clearTimeout(loading);
			updateEditor({ running: false });
		}
	}
	return { runCode };
}
