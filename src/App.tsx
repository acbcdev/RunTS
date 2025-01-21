import { CodeEditor } from "@/components/code-editor/code-editor";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useEditorStore } from "@/store/editor";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function App() {
	const { addTab, setActiveTab } = useEditorStore();
	const { toast } = useToast();
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		window.history.replaceState(null, "", "/");
		if (code) {
			try {
				const codigo = atob(code);
				const id = addTab({
					name: "shared.ts",
					language: "typescript",
					code: codigo,
					logs: [],
				});
				setActiveTab(id);
			} catch {
				toast({
					variant: "destructive",
					title: "Invalid Code",
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
