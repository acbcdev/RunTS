import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { refreshTimes, renderLines } from "@/consts";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { useShallow } from "zustand/react/shallow";

export function Editor() {
  const { expression, setExpression, setAlignLogs, alignLogs } = useEditorStore(
    useShallow((state) => ({
      expression: state.expression,
      setExpression: state.setExpression,
      alignLogs: state.alignLogs,
      setAlignLogs: state.setAlignLogs,
    }))
  );
  const {
    wordWrap,
    setWordWrap,
    lineNumbers,
    setLineNumbers,
    minimap,
    setMinimap,
    whiteSpace,
    setWhiteSpace,
    refreshTime,
    setRefreshTime,
    lineRenderer,
    setLineRenderer,
  } = useConfigStore(
    useShallow((state) => ({
      wordWrap: state.wordWrap,
      setWordWrap: state.setWordWrap,
      lineNumbers: state.lineNumbers,
      setLineNumbers: state.setLineNumbers,
      minimap: state.minimap,
      setMinimap: state.setMinimap,
      whiteSpace: state.whiteSpace,
      setWhiteSpace: state.setWhiteSpace,
      refreshTime: state.refreshTime,
      setRefreshTime: state.setRefreshTime,
      lineRenderer: state.lineRenderer,
      setLineRenderer: state.setLineRenderer,
    }))
  );
  const SettingsEditor = [
    {
      label: "Word Wrap",
      callback: () => setWordWrap(!wordWrap),
      value: wordWrap,
      description: "Wrap long lines of code",
    },
    {
      label: "Line Numbers",
      callback: () => setLineNumbers(!lineNumbers),
      value: lineNumbers,
      description: "Show line numbers in the editor",
    },
    {
      label: "Minimap",
      callback: () => setMinimap(!minimap),
      value: minimap,
      description: "Show minimap in the editor",
    },
    {
      label: "White Space",
      callback: () => setWhiteSpace(!whiteSpace),
      value: whiteSpace,
      description: "Show white space in the editor",
    },
  ];
  return (
    <TabsContent value="editor" className="p-6 m-0">
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-base font-medium">Editor Behavior</h3>
          <div className="space-y-4 md:columns-2">
            {SettingsEditor.map(({ label, description, value, callback }) => (
              <EditorSwitch
                key={label}
                label={label}
                description={description}
                value={value}
                callback={callback}
              />
            ))}
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-base font-medium">Line Renderer</h3>
          <div className="grid grid-cols-6 gap-2 md:grid-cols-8">
            {renderLines.map((renderline) => (
              <Button
                key={renderline}
                variant={lineRenderer === renderline ? "border" : "outline"}
                onClick={() => setLineRenderer(renderline)}
              >
                {renderline}
              </Button>
            ))}
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-base font-medium">Refresh Time</h3>
          <div className="grid grid-cols-6 gap-2 md:grid-cols-8">
            {refreshTimes.map(({ time, value }) => (
              <Button
                key={time}
                variant={refreshTime === value ? "border" : "outline"}
                onClick={() => setRefreshTime(value)}
              >
                {time}
              </Button>
            ))}
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-base font-medium">Advanced</h3>
          <div className="space-y-4">
            <EditorSwitch
              label="Expression Runner"
              description="Automatically displays the output of expressions in the console without requiring console.log(). Works with any expression, not just console info error and warn."
              value={expression}
              callback={() => setExpression(!expression)}
            />
            <EditorSwitch
              label="Align Logs"
              description="Aligns the logs in the console to the left."
              value={alignLogs}
              callback={() => setAlignLogs(!alignLogs)}
            />
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
type EditorSwitchProps = {
  label: string;
  description: string;
  value: boolean;
  callback: () => void;
};
function EditorSwitch({
  label,
  description,
  value,
  callback,
}: EditorSwitchProps) {
  return (
    <Label
      key={label}
      className="flex border items-center justify-between p-3 md:gap-x-4 rounded-lg "
    >
      <div className="space-y-1">
        <h3 className="font-bold  ">{label}</h3>
        <p className="text-sm font-medium opacity-60">{description}</p>
      </div>
      <Switch checked={value} onCheckedChange={callback} />
    </Label>
  );
}
