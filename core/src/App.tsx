import { CodeEditor } from "@core/components/code-editor/code-editor";
import { TooltipProvider } from "@core/components/ui/tooltip";
import { Toaster } from "@core/components/ui/toaster";
import { useEditorStore } from "./store/editor";
import { useEffect } from "react";

function App({ code }: { code?: string | null }) {
  const { addTab, setActiveTab } = useEditorStore()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (code) {
      const codigo = atob(code)
      const id = addTab({ name: "shared.ts", language: "typescript", code: codigo, logs: [], logFormated: "" })
      setActiveTab(id)
    }
  }, [])
  return (
    <>
      <TooltipProvider>
        <CodeEditor />
        <Toaster />
      </TooltipProvider>
    </>
  );
}
export default App;
