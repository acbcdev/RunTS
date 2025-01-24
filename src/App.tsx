import { CodeEditor } from "@/components/code-editor/code-editor";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useEditorStore } from "@/store/editor";
import { useEffect } from "react";
import { toast } from "sonner";
import { PromptProvider } from "@/providers/promptProvider";
import { useShallow } from "zustand/react/shallow";
function App() {
	const { addTab, setActiveTab } = useEditorStore(useShallow((state) => state));
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
				toast("invaliad Code", {
					description: "The code is error on decode",
				});
			}
		}
	}, []);
	return (
		<>
			<TooltipProvider delayDuration={500} skipDelayDuration={100}>
				<PromptProvider>
					<CodeEditor />
				</PromptProvider>
				<Toaster />
			</TooltipProvider>
		</>
	);
}
export default App;
