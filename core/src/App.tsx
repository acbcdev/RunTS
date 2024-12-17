import { CodeEditor } from "@core/components/code-editor/code-editor";
import { TooltipProvider } from "@core/components/ui/tooltip";
import { Toaster } from "@core/components/ui/toaster";

function App() {
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
