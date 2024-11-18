import { CodeEditor } from '@/components/code-editor/code-editor'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <TooltipProvider>
      <CodeEditor />
      <Toaster />
    </TooltipProvider>
  )
}

export default App