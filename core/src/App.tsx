import { CodeEditor } from "@core/components/code-editor/code-editor";
import { TooltipProvider } from "@core/components/ui/tooltip";
import { Toaster } from "@core/components/ui/toaster";
import { useEditorStore } from "./store/editor";
import { useEffect } from "react";
import { useToast } from "@core/hooks/use-toast";

function App({ code }: { code?: string | null }) {
  const { addTab, setActiveTab } = useEditorStore()
  const { toast } = useToast()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (code) {
      try {
        const codigo = atob(code)
        const id = addTab({ name: "shared.ts", language: "typescript", code: codigo, logs: [], logFormated: "" })
        setActiveTab(id)

      } catch {
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: "The code is error on decode",
        })
      }
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
