import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDebounce } from "@/features/common/hooks/useDebounce";
import { useConfigStore } from "@/features/settings/config-store/config";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useRun } from "../use-run/useRun";

export function useEditorSession() {
	const { runCode } = useRun();
	const tab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const refreshTime = useConfigStore(useShallow((state) => state.refreshTime));
	const debouncedCode = useDebounce(tab?.code ?? "", refreshTime);

	// biome-ignore lint/correctness/useExhaustiveDependencies: auto-run only on debounced code change
	useEffect(() => {
		runCode();
	}, [debouncedCode]);

	return { tab, runCode };
}
