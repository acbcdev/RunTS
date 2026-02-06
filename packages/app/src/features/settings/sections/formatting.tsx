import { useShallow } from "zustand/react/shallow";
import { SettingButtonGroup } from "@/features/settings/components/SettingButtonGroup";
import { SettingSwitch } from "@/features/settings/components/SettingSwitch";
import { Label } from "@/features/ui/label";
import { TabsContent } from "@/features/ui/tabs";
import {
  AUTO_INDENT_OPTIONS,
  PRINT_WIDTHS,
  TAB_SIZES,
} from "../config-consts/config";
import { useConfigStore } from "../config-store/config";

export function Formatting() {
  const configState = useConfigStore(
    useShallow((state) => ({
      tabSize: state.tabSize,
      insertSpaces: state.insertSpaces,
      formatOnPaste: state.formatOnPaste,
      formatOnType: state.formatOnType,
      autoIndent: state.autoIndent,
      printWidth: state.printWidth,
      updateConfig: state.updateConfig,
    })),
  );

  return (
    <TabsContent value="formatting" className="p-6 m-0">
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-base font-medium">Indentation</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tab Size</Label>
              <SettingButtonGroup
                options={TAB_SIZES}
                value={configState.tabSize}
                onChange={(size) => configState.updateConfig({ tabSize: size })}
                renderLabel={(size) => `${size} spaces`}
                className="grid grid-cols-8 gap-2"
              />
            </div>
            <SettingSwitch
              label="Insert Spaces"
              description="Use spaces instead of tabs for indentation"
              value={configState.insertSpaces}
              callback={() =>
                configState.updateConfig({
                  insertSpaces: !configState.insertSpaces,
                })
              }
            />
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-medium">Auto-Formatting</h3>
          <div className="space-y-4">
            <SettingSwitch
              label="Format On Paste"
              description="Automatically format code when pasting"
              value={configState.formatOnPaste}
              callback={() =>
                configState.updateConfig({
                  formatOnPaste: !configState.formatOnPaste,
                })
              }
            />
            <SettingSwitch
              label="Format On Type"
              description="Automatically format code as you type"
              value={configState.formatOnType}
              callback={() =>
                configState.updateConfig({
                  formatOnType: !configState.formatOnType,
                })
              }
            />
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-medium  ">Advanced</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Auto Format</Label>
              <p className="text-sm font-medium opacity-60">
                Controls how aggressive auto-formatting is
              </p>
            </div>
            <SettingButtonGroup
              options={[...AUTO_INDENT_OPTIONS]}
              value={configState.autoIndent}
              onChange={(option) =>
                configState.updateConfig({ autoIndent: option.value })
              }
              onValue={(v) => v.value}
              renderLabel={(option) => option.label}
              className="grid grid-cols-8 gap-2"
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Print Width</Label>
              <p className="text-sm font-medium opacity-60">
                Maximum line length for code formatting (Prettier)
              </p>
              <SettingButtonGroup
                options={[...PRINT_WIDTHS]}
                value={configState.printWidth}
                onChange={(width) =>
                  configState.updateConfig({ printWidth: width })
                }
                className="grid grid-cols-8 gap-2"
              />
            </div>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
