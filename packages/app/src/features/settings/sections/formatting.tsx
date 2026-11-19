import { TabsContent } from "@/features/ui/tabs";
import { SettingButtonGroup } from "../components/SettingButtonGroup";
import { SettingSwitch } from "../components/SettingSwitch";
import { SettingsSection } from "../components/SettingsSection";
import {
	AUTO_INDENT_OPTIONS,
	PRINT_WIDTHS,
	TAB_SIZES,
} from "../config-consts/config";
import { useConfigStore } from "../config-store/config";

const indentGlyphs = {
	none: "—",
	keep: "↳",
	brackets: "{}",
	advanced: "≡",
	full: "✦",
};

export function Formatting() {
	const {
		tabSize,
		insertSpaces,
		formatOnPaste,
		formatOnType,
		autoIndent,
		printWidth,
		updateConfig,
	} = useConfigStore();
	return (
		<TabsContent value="formatting" className="m-0 flex flex-col gap-7">
			<SettingsSection title="Indentation">
				<SettingButtonGroup
					label="Tab size"
					description="Width of each indentation level."
					options={TAB_SIZES}
					value={tabSize}
					onChange={(size) => updateConfig({ tabSize: size })}
					renderLabel={(size) => `${size} spaces`}
					renderPreview={(size) => (
						<span className="text-2xl tabular-nums">{size}</span>
					)}
				/>
				<SettingSwitch
					label="Insert Spaces"
					description="Use spaces instead of tab characters."
					value={insertSpaces}
					callback={() => updateConfig({ insertSpaces: !insertSpaces })}
				/>
			</SettingsSection>
			<SettingsSection title="Auto-formatting">
				<SettingSwitch
					label="Format On Paste"
					description="Format pasted code automatically."
					value={formatOnPaste}
					callback={() => updateConfig({ formatOnPaste: !formatOnPaste })}
				/>
				<SettingSwitch
					label="Format On Type"
					description="Format code as you type."
					value={formatOnType}
					callback={() => updateConfig({ formatOnType: !formatOnType })}
				/>
			</SettingsSection>
			<SettingsSection title="Advanced">
				<SettingButtonGroup
					label="Auto indentation"
					description="Adjust indentation when typing and pasting."
					options={AUTO_INDENT_OPTIONS}
					value={autoIndent}
					onValue={(option) => option.value}
					onChange={(option) => updateConfig({ autoIndent: option.value })}
					renderLabel={(option) => option.label}
					renderPreview={(option) => (
						<span className="text-2xl">{indentGlyphs[option.value]}</span>
					)}
				/>
				<SettingButtonGroup
					label="Print width"
					description="Preferred line length for Prettier."
					options={PRINT_WIDTHS}
					value={printWidth}
					onChange={(width) => updateConfig({ printWidth: width })}
					renderLabel={(width) => `${width} columns`}
					renderPreview={(width) => (
						<span className="text-2xl tabular-nums">{width}</span>
					)}
				/>
			</SettingsSection>
		</TabsContent>
	);
}
