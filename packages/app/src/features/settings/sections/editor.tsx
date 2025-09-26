import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/features/ui/button";
import { Label } from "@/features/ui/label";
import { Switch } from "@/features/ui/switch";
import { TabsContent } from "@/features/ui/tabs";
import {
	EDITOR_SETTINGS_CONFIG,
	REFRESH_TIMES,
	RENDER_LINES,
} from "@/features/common/utils/config";
import { useConfigStore } from "@/features/settings/store/config";
import { useEditorStore } from "@/store/editor";

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
						{RENDER_LINES.map((renderline) => (
							<Button
								key={renderline}
								variant={
									configState.lineRenderer === renderline ? "border" : "outline"
								}
								onClick={() =>
									configState.updateConfig({ lineRenderer: renderline })
								}
							>
								{renderline}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Refresh Time</h3>
					<div className="grid grid-cols-6 gap-2 md:grid-cols-8">
						{REFRESH_TIMES.map(({ time, value }) => (
							<Button
								key={time}
								variant={
									configState.refreshTime === value ? "border" : "outline"
								}
								onClick={() => configState.updateConfig({ refreshTime: value })}
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
							callback={() => updateEditor({ expression: !expression })}
						/>
						<EditorSwitch
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
