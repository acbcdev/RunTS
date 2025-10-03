import type {
	ConfigEditorActions,
	ConfigEditorState,
} from "@/features/settings/config-store/config";

export type EditorSettingItem = {
	label: string;
	callback: () => void;
	value: boolean;
	description: string;
};

/**
 * Generates the editor settings configuration
 * @param config Current config state
 * @param updateConfig Function to update config
 * @returns Array of editor setting items
 */
export function createEditorSettings(
	config: Pick<
		ConfigEditorState,
		"wordWrap" | "lineNumbers" | "minimap" | "whiteSpace"
	>,
	updateConfig: ConfigEditorActions["updateConfig"],
): EditorSettingItem[] {
	return [
		{
			label: "Word Wrap",
			callback: () => updateConfig({ wordWrap: !config.wordWrap }),
			value: config.wordWrap,
			description: "Wrap long lines of code",
		},
		{
			label: "Line Numbers",
			callback: () => updateConfig({ lineNumbers: !config.lineNumbers }),
			value: config.lineNumbers,
			description: "Show line numbers in the editor",
		},
		{
			label: "Minimap",
			callback: () => updateConfig({ minimap: !config.minimap }),
			value: config.minimap,
			description: "Show minimap in the editor",
		},
		{
			label: "White Space",
			callback: () => updateConfig({ whiteSpace: !config.whiteSpace }),
			value: config.whiteSpace,
			description: "Show white space in the editor",
		},
	];
}
