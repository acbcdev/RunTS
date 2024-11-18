import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"
import { useEditorStore } from '@/store/editor'

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>) => {
  const { getCurrentTheme } = useEditorStore()
  const theme = getCurrentTheme()

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        `relative flex w-[4px] transition-all hover:w-2 active:w-1 hover:bg-[${theme.ui.accent}] cursor-col-resize`,
        className
      )}
      style={{
        backgroundColor: theme.ui.border,
        '--hover-bg': theme.ui.border,
        '--active-bg': theme.ui.accent
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
