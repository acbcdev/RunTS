import { useShallow } from "zustand/react/shallow";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../editor-store";
import { runTab } from "../run-code";

export function useRun() {
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const updateTab = useTabsStore(useShallow((state) => state.updateTab));

	const updateEditor = useEditorStore(
		useShallow((state) => state.updateEditor),
	);
	const injectLogs = useEditorStore(useShallow((state) => state.expression));
	const alignLogs = useEditorStore(useShallow((state) => state.alignLogs));

	async function runCode() {
		if (!activeTab) return;
		const loading = setTimeout(() => updateEditor({ running: true }), 500);
		try {
			const log = await runTab(activeTab, { injectLogs, alignLogs });
			if (log !== null) updateTab(activeTab.id, { log });
		} finally {
			clearTimeout(loading);
			updateEditor({ running: false });
		}
	}
	return { runCode };
}
