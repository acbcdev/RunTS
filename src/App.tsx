import { CodeEditor } from "@/components/Editor/CodeEditor";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTabsStore } from "@/store/tabs";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { decode } from "js-base64";

function App() {
	const { addTab, setActiveTab } = useTabsStore(useShallow((state) => state));
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		window.history.replaceState(null, "", "/");
		if (code) {
			try {
				const decodedCode = decode(code);
				const id = addTab({
					name: "shared.ts",
					language: "typescript",
					code: decodedCode,
					logs: [],
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
		<>
			<TooltipProvider delayDuration={500} skipDelayDuration={100}>
				<CodeEditor />
				<Toaster />
			</TooltipProvider>
		</>
	);
}
export default App;
