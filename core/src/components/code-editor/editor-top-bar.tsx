import {
  Play,
  Download,
  Copy,
  Trash2,
  Columns,
  Rows,
  Share2,
} from "lucide-react";
import { Button } from "@core/components/ui/button";
import { Tooltip } from "@core/components/ui/tooltip";
import { useToast } from "@core/hooks/use-toast";
import { useEditorStore } from "@core/store/editor";
import { EditorSettingsDialog } from "@core/components/settings/editor-setting-dialog";
import { useConfigStore } from "@core/store/config";
import { memo } from "react";

export const EditorTopBar = memo(function EditorTopBar() {
  const { toast } = useToast();
  const {
    code,
    getCurrentTheme,
    clearConsole,
    runCode,
    activeTabId,
  } = useEditorStore();
  const { layout, setLayout } = useConfigStore();
  const currentTheme = getCurrentTheme();

  const handleShare = () => {
    const url = new URL(window.location.href);
    if (code === "") {
      toast({
        variant: "destructive",
        title: "Empty Code",
        description: "The code is empty, nothing to share.",
        duration: 2000,
      });
      return;
    }
    const link = `${url.origin}/?code=${btoa(code)}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Created",
      description: `The ${link} has been copied to your clipboard.`,
      duration: 2000,
    });
  };
  const toogleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal");
  };
  const handleClear = () => {
    clearConsole(activeTabId);
    toast({
      title: "Console cleared",
      description: "The console output has been cleared.",
      duration: 2000,
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "The code has been copied to your clipboard.",
      duration: 2000,
    });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Code downloaded!",
      description: "The code has been downloaded as 'code.js'",
      duration: 2000,
    });
  };

  return (
    <div
      className={"flex items-center justify-between p-2 border-b "}
      style={{
        borderColor: currentTheme.ui.border,
        backgroundColor: currentTheme.ui.header,
      }}
    >
      <div className="flex items-center space-x-2">

        <EditorSettingsDialog />
        <Tooltip content="Run code (Ctrl+Q)">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.success,
                "--hover-color": currentTheme.ui.success,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
            onClick={runCode}
          >
            <Play className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Toogle layout">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.foreground,
              } as React.CSSProperties
            }
            onClick={toogleLayout}
          >
            {layout === "horizontal" ? (
              <Columns className="size-4" />
            ) : (
              <Rows className="size-4" />
            )}
          </Button>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip content="Share Code current Tab">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.foreground,
                "--hover-color": currentTheme.ui.warning,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Copy code">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.foreground,
                "--hover-color": currentTheme.ui.warning,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
            onClick={copyCode}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Download code">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.foreground,
                "--hover-color": currentTheme.ui.warning,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
            onClick={downloadCode}
          >
            <Download className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Clear console">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={
              {
                color: currentTheme.ui.foreground,
                "--hover-color": currentTheme.ui.warning,
                "--hover-bg": currentTheme.ui.hover,
              } as React.CSSProperties
            }
            onClick={handleClear}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
});
