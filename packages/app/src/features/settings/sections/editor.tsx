import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "@/features/editor/editor-store/editor";
import { SettingSwitch } from "@/features/settings/components/SettingSwitch";
import { SettingButtonGroup } from "@/features/settings/components/SettingButtonGroup";
import { TabsContent } from "@/features/ui/tabs";
import {
	EDITOR_SETTINGS_CONFIG,
	REFRESH_TIMES,
	RENDER_LINES,
} from "../config-consts/config";
import { useConfigStore } from "../config-store/config";

export function Editor() {
	const expression = useEditorStore(useShallow((state) => state.expression));
	const alignLogs = useEditorStore(useShallow((state) => state.alignLogs));
	const updateEditor = useEditorStore(
		useShallow((state) => state.updateEditor),
	);
	const configState = useConfigStore(
		useShallow((state) => ({
			wordWrap: state.wordWrap,
			lineNumbers: state.lineNumbers,
			minimap: state.minimap,
			whiteSpace: state.whiteSpace,
			refreshTime: state.refreshTime,
			lineRenderer: state.lineRenderer,
			updateConfig: state.updateConfig,
		})),
	);

	const editorSettings = useMemo(
		() =>
			EDITOR_SETTINGS_CONFIG.map((setting) => ({
				...setting,
				value: configState[setting.key],
				callback: () =>
					configState.updateConfig({
						[setting.key]: !configState[setting.key],
					}),
			})),
		[configState],
	);
	return (
		<TabsContent value="editor" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 className="mb-4 text-base font-medium">Editor Behavior</h3>
					<div className="space-y-4 md:columns-2">
						{editorSettings.map(({ label, description, value, callback }) => (
							<SettingSwitch
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
					<SettingButtonGroup
						options={RENDER_LINES}
						value={configState.lineRenderer}
						onChange={(value) => configState.updateConfig({ lineRenderer: value })}
						className="grid grid-cols-6 gap-2 md:grid-cols-8"
					/>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Refresh Time</h3>
					<SettingButtonGroup
						options={REFRESH_TIMES}
						value={configState.refreshTime}
						onChange={(option) => configState.updateConfig({ refreshTime: option.value })}
						renderLabel={(option) => option.time}
						className="grid grid-cols-6 gap-2 md:grid-cols-8"
					/>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Advanced</h3>
					<div className="space-y-4">
						<SettingSwitch
							label="Expression Runner"
							description="Automatically displays the output of expressions in the console without requiring console.log(). Works with any expression, not just console info error and warn."
							value={expression}
							callback={() => updateEditor({ expression: !expression })}
						/>
						<SettingSwitch
							label="Align Logs"
							description="Aligns the logs in the console to the left."
							value={alignLogs}
							callback={() => updateEditor({ alignLogs: !alignLogs })}
						/>
					</div>
				</section>
			</div>
		</TabsContent>
	);
}
