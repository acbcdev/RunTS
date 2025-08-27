import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTabsStore } from "@/store/tabs";
import { decode } from "js-base64";
import {  lazy, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { CommandK } from "./components/CommandK";
import { ShortCutsModal } from "./components/ShortCuts";
import { EditorSettingsDialog } from "./components/settings/EditorSettingDialog";
import { MESSAGE_LOG } from "./consts";
const CodeEditor = lazy(() => import("@/components/editor/CodeEditor"));

function App() {
	const addTab = useTabsStore(useShallow((state) => state.addTab));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
					log:""
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
		<ErrorBoundary>
			<TooltipProvider delayDuration={500} skipDelayDuration={100}>
				{/* <ErrorBoundaryTester /> */}
				<CommandK />
				<EditorSettingsDialog />
				<ShortCutsModal />
				{/* <Suspense fallback={<Loader text="Loading workspace..." />}> */}
				{/* <AppLoader/> */}
					<CodeEditor />
				{/* </Suspense> */}
				<Toaster />
			</TooltipProvider>
		</ErrorBoundary>
	);
}
export default App;
