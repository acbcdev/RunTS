import { CodeEditor } from '@/components/code-editor/code-editor'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import SEO from './components/SEO'

function App() {
  return (
    <>
      <SEO title='RunTS - TypeScript Playground' />
      <TooltipProvider>
        <CodeEditor />
        <Toaster />
      </TooltipProvider>
    </>
  )
}

export default App