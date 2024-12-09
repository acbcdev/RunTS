import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"
import { useEditorStore } from '@/store/editor'
import { useConfigStore } from '@/store/config'


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
  const { layout } = useConfigStore()
  const theme = getCurrentTheme()

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        `relative flex   ${layout === "horizontal" ? "h-full w-[4px] hover:scale-x-[2]" : "w-full h-[4px] hover:scale-y-[2]"} cursor-col-resize`,
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
