import { Button } from "@core/components/ui/button";
import { TabsContent } from "@core/components/ui/tabs";
import { refreshTimes } from "@core/consts";
import { useConfigStore } from "@core/store/config";
import { useEditorStore } from "@core/store/editor";
import { Switch } from "@core/components/ui/switch";

export function Editor() {
  const {
    wordWrap,
    lineNumbers,
    refreshTime,
    minimap,
    whiteSpace,
    setMinimap,
    setWordWrap,
    setWhiteSpace,
    setLineNumbers,
    setRefreshTime,
  } = useConfigStore();
  const { getCurrentTheme, setExperimental, experimetalConsole } =
    useEditorStore();
  const currentTheme = getCurrentTheme();
  const editorBehaviors = [
    {
      id: "wordWrap",
      callback: setWordWrap,
      value: wordWrap,
      label: "Word Wrap",
      description: "Wrap long lines of code",
    },
    {
      id: "lineNumbers",
      callback: setLineNumbers,
      value: lineNumbers,
      label: "Line Numbers",
      description: "Show line numbers in the editor",
    },
    {
      id: "minimap",
      callback: setMinimap,
      value: minimap,
      label: "Minimap",
      description: "Show minimap in the editor",
    },
    {
      id: "whiteSpace",
      callback: setWhiteSpace,
      value: whiteSpace,
      label: "White Space",
      description: "Show white space in the editor",
    },
  ];
  return (
    <TabsContent value="editor" className="p-6 m-0">
      <div className="space-y-8">
        <section>
          <h3
            className="mb-4 text-base font-medium"
            style={{ color: currentTheme.ui.foreground }}
          >
            Editor Behavior
          </h3>
          <div className="space-y-4">
            {editorBehaviors.map(
              ({ id, callback, value, label, description }) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded"
                  style={{ backgroundColor: currentTheme.ui.hover }}
                >
                  <div>
                    <div style={{ color: currentTheme.ui.foreground }}>
                      {label}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: currentTheme.ui.muted }}
                    >
                      {description}
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => callback(!value)}
                  />
                </div>
              ),
            )}
          </div>
        </section>

        <section>
          <h3
            className="mb-4 text-base font-medium"
            style={{ color: currentTheme.ui.foreground }}
          >
            Refresh Time
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {refreshTimes.map(({ time, value }) => (
              <Button
                key={time}
                className="p-3 text-center transition-all duration-200 border rounded"
                style={{
                  borderColor:
                    refreshTime === value
                      ? currentTheme.ui.accent
                      : currentTheme.ui.border,
                  color:
                    refreshTime === value ? currentTheme.ui.foreground : "",
                  backgroundColor: "transparent",
                }}
                onClick={() => setRefreshTime(value)}
              >
                {time}
              </Button>
            ))}
          </div>
        </section>
        <section>
          <h3
            className="mb-4 text-base font-medium"
            style={{ color: currentTheme.ui.foreground }}
          >
            Experimetal
          </h3>
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-3 rounded"
              style={{ backgroundColor: currentTheme.ui.hover }}
            >
              <div>
                <div style={{ color: currentTheme.ui.foreground }}>
                  Direct Console.log
                </div>
                <div
                  className="text-sm"
                  style={{ color: currentTheme.ui.muted }}
                >
                  show the Console.log without need to use the
                  console.log(variable)
                  only works inline
                </div>
              </div>
              <Switch
                checked={experimetalConsole}
                onCheckedChange={() => setExperimental(!experimetalConsole)}
              />
            </div>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
