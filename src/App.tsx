import { CodeEditor } from '@/components/code-editor/code-editor'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import SEO from './components/SEO'

function App() {
  return (
    <TooltipProvider>
      <SEO title='RunTS - TypeScript Playground' />
      <CodeEditor />
      <Toaster />
    </TooltipProvider>
  )
}

export default App