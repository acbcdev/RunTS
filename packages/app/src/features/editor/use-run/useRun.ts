import { useShallow } from "zustand/react/shallow";
import { ajuestLogs } from "@/features/common/utils/ajuestLogs";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../editor-store";
import { runCodeWorker } from "../run-code";

export function useRun() {
  const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
  // const updateTabLog = useTabsStore(useShallow((state) => state.updateTabLog));
  const updateTabLog = useTabsStore(useShallow((state) => state.updateTabLog));

  const updateEditor = useEditorStore(
    useShallow((state) => state.updateEditor)
  );
  const expression = useEditorStore(useShallow((state) => state.expression));
  const alignLogs = useEditorStore(useShallow((state) => state.alignLogs));

  async function runCode() {
    if (!activeTab) return;
    if (activeTab.code.trim() === "") {
      updateTabLog(activeTab.id, "");
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
      updateTabLog(activeTab.id, logs);
    } catch (error) {
      updateTabLog(activeTab.id, String(error));
    } finally {
      clearTimeout(loading);
      updateEditor({ running: false });
    }
  }
  return { runCode };
}
