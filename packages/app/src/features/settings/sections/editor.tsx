import { useId } from "react";
import { useEditorStore } from "@/features/editor/editor-store/editor";
import { SettingButtonGroup } from "@/features/settings/components/SettingButtonGroup";
import { SettingSwitch } from "@/features/settings/components/SettingSwitch";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/ui/select";
import { TabsContent } from "@/features/ui/tabs";
import {
	EDITOR_SETTINGS_CONFIG,
	REFRESH_TIMES,
	RENDER_LINES,
} from "../config-consts/config";
import { useConfigStore } from "../config-store/config";

const lineLabels = { none: "Off", gutter: "Gutter", line: "Line", all: "Both" };
const lineGlyphs = { none: "—", gutter: "▏", line: "━", all: "▕━" };

export function Editor() {
	const { expression, alignLogs, updateEditor } = useEditorStore();
	const config = useConfigStore();
	const id = useId();
	return (
		<TabsContent value="editor" className="m-0 flex flex-col gap-7">
			<SettingsSection title="Editor behavior">
				{EDITOR_SETTINGS_CONFIG.map(({ key, label, description }) => (
					<SettingSwitch
						key={key}
						label={label}
						description={description}
						value={config[key]}
						callback={() => config.updateConfig({ [key]: !config[key] })}
					/>
				))}
			</SettingsSection>
			<SettingsSection title="Execution">
				<SettingButtonGroup
					label="Active line"
					description="Where should the current line be highlighted?"
					options={RENDER_LINES}
					value={config.lineRenderer}
					onChange={(lineRenderer) => config.updateConfig({ lineRenderer })}
					renderLabel={(value) => lineLabels[value]}
					renderPreview={(value) => (
						<span className="text-2xl">{lineGlyphs[value]}</span>
					)}
				/>
				<div className="flex items-center justify-between gap-4 py-2">
					<div>
						<label htmlFor={id} className="text-xs">
							Run delay
						</label>
						<p
							id={`${id}-description`}
							className="mt-1 text-[10px] text-foreground/65"
						>
							Wait before running code after an edit.
						</p>
					</div>
					<Select
						value={String(config.refreshTime)}
						onValueChange={(value) =>
							config.updateConfig({ refreshTime: Number(value) })
						}
					>
						<SelectTrigger
							id={id}
							aria-describedby={`${id}-description`}
							className="w-28 shrink-0"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{REFRESH_TIMES.map(({ value, time }) => (
									<SelectItem key={value} value={String(value)}>
										{time}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</SettingsSection>
			<SettingsSection title="Advanced">
				<SettingSwitch
					label="Expression Runner"
					description="Show expression results without console.log()."
					value={expression}
					callback={() => updateEditor({ expression: !expression })}
				/>
				<SettingSwitch
					label="Align Logs"
					description="Align output with its source line."
					value={alignLogs}
					callback={() => updateEditor({ alignLogs: !alignLogs })}
				/>
			</SettingsSection>
		</TabsContent>
	);
}
