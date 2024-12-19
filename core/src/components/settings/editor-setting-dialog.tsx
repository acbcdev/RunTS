import { Settings2 } from "lucide-react";
import { Button } from "@core/components/ui/button";
import { Tooltip } from "@core/components/ui/tooltip";
import { useEditorStore } from "@core/store/editor";
import { Appearance } from "@core/components/settings/tabs/appearance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@core/components/ui/dialog";
import { ScrollArea } from "@core/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@core/components/ui/tabs";
import { Editor } from "./tabs/editor";

export function EditorSettingsDialog() {
  const { getCurrentTheme } = useEditorStore();

  const currentTheme = getCurrentTheme();

  return (
    <Dialog >
      <Tooltip content="Editor settings">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            translate="no"
            style={
              {
                color: currentTheme.ui.foreground,
                "--hover-color": currentTheme.ui.warning,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent
        className="p-0 overflow-hidden  xl:max-w-5xl lg:max-w-3xl"
        style={{
          backgroundColor: currentTheme.ui.background,
          borderColor: currentTheme.ui.border,
        }}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle style={{ color: currentTheme.ui.foreground }}>
            Editor Settings
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2 ">
            <a
              href="https://www.buymeacoffee.com/runts"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                alt="Buy Me A Coffee"
                className="h-10 my-2"
              />
            </a>
            <a
              href="https://github.com/acbcdev/runts"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://img.shields.io/github/stars/acbcdev/runts?style=flat&logo=github
"
                alt="Stars"
                className="h-10 my-2"
              />
            </a>
          </div>
        </DialogHeader>
        <Tabs defaultValue="appearance" className="flex-1">
          <TabsList
            className="h-12 px-6 "
            style={{
              backgroundColor: "transparent",
              borderColor: currentTheme.ui.accent,
            }}
          >
            <TabsTrigger
              value="appearance"
              style={
                {
                  color: currentTheme.ui.foreground,
                } as React.CSSProperties
              }
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              style={
                {
                  color: currentTheme.ui.foreground,
                } as React.CSSProperties
              }
            >
              Editor
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="max-h-[85vh] h-[60vh] ">
            <Appearance />
            <Editor />
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
