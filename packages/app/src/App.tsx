/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { decode } from "js-base64";
import { lazy, Suspense, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { CommandK } from "@/features/common/command/CommandK";
import { ErrorBoundary } from "@/features/common/error/ErrorBoundary";
import { ShortCutsModal } from "@/features/common/shortcuts/ShortCuts";
import { MESSAGE_LOG } from "@/features/common/utils/const";
import { EditorSettingsDialog } from "@/features/settings/editor-setting-dialog/EditorSettingDialog";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { Toaster } from "@/features/ui/sonner";
import { TooltipProvider } from "@/features/ui/tooltip";

const CodeEditor = lazy(
	() => import("@/features/editor/code-editor/CodeEditor"),
);

const queryClient = new QueryClient();

function App() {
	const addTab = useTabsStore(useShallow((state) => state.addTab));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));

	useEffect(() => {
		console.log(MESSAGE_LOG);
		const code = new URLSearchParams(window.location.search).get("code");
		window.history.replaceState(null, "", "/");
		if (code) {
			try {
				const decodedCode = decode(code);
				const id = addTab({
					name: "shared.ts",
					language: "typescript",
					code: decodedCode,
					log: "",
				});
				setActiveTab(id);
				toast.success("Code loaded", {
					description: "The code has been loaded.",
					duration: 2000,
				});
			} catch {
				toast.error("invaliad Code", {
					description: "The code is error on decode",
				});
			}
		}
	}, []);
	return (
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<TooltipProvider delayDuration={500} skipDelayDuration={100}>
					<CommandK />
					<EditorSettingsDialog />
					<ShortCutsModal />
					<Suspense fallback={<div>Loading editor...</div>}>
						<CodeEditor />
					</Suspense>
					<Toaster />
				</TooltipProvider>
			</ErrorBoundary>
		</QueryClientProvider>
	);
}
export default App;
