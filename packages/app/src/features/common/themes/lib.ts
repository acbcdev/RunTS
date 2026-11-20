import type { Theme } from "@/features/editor/types";
import type { ThemeProps } from "./types";

export function createTheme({
	name,
	ui,
	monaco,
	base = "vs-dark",
	colors: colorOverrides,
	tokenColors: extraTokenColors = [],
}: ThemeProps): Theme {
	const colors = { ...buildColors(ui, monaco), ...colorOverrides };
	return {
		name,
		shiki: {
			name,
			type: base === "vs" ? "light" : "dark",
			colors,
			tokenColors: [
				{
					scope: ["comment", "punctuation.definition.comment"],
					settings: { foreground: monaco.comment, fontStyle: "italic" },
				},
				{
					scope: [
						"keyword",
						"storage",
						"storage.type",
						"keyword.control",
						"constant.language",
						"variable.language.this",
					],
					settings: { foreground: monaco.keyword },
				},
				{
					scope: ["string", "string.template", "punctuation.definition.string"],
					settings: { foreground: monaco.string },
				},
				{
					scope: ["constant.numeric", "constant.language.boolean"],
					settings: { foreground: monaco.number },
				},
				{
					scope: ["keyword.operator", "storage.type.function.arrow"],
					settings: { foreground: monaco.operator },
				},
				{
					scope: [
						"entity.name.function",
						"support.function",
						"meta.function-call entity.name.function",
					],
					settings: { foreground: monaco.function },
				},
				{
					scope: ["variable", "support.variable", "support.constant"],
					settings: { foreground: monaco.variable },
				},
				{
					scope: ["meta.definition.variable", "variable.other.constant"],
					settings: { foreground: monaco.function },
				},
				{
					scope: ["variable.parameter"],
					settings: { foreground: monaco.variable, fontStyle: "italic" },
				},
				{
					scope: [
						"entity.name.type",
						"entity.name.class",
						"support.type",
						"support.class",
						"entity.other.inherited-class",
						"variable.other.object",
						"support.variable.object",
						"support.variable.dom",
						"support.class.console",
					],
					settings: { foreground: monaco.type },
				},
				{
					scope: ["variable.other.property", "meta.object-literal.key"],
					settings: { foreground: monaco.variable },
				},
				{
					scope: ["punctuation", "meta.brace"],
					settings: { foreground: ui.foreground },
				},
				{
					scope: ["punctuation.definition.string"],
					settings: { foreground: monaco.string },
				},
				...extraTokenColors,
			],
		},
		value: name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, ""),
		ui: {
			...ui,
		},
		monaco: {
			base,
			inherit: true,
			rules: [
				{ token: "comment", foreground: monaco.comment, fontStyle: "italic" },
				{ token: "keyword", foreground: monaco.keyword },
				{ token: "string", foreground: monaco.string },
				{ token: "number", foreground: monaco.number },
				{ token: "operator", foreground: monaco.operator },
				{ token: "function", foreground: monaco.function },
				{ token: "variable", foreground: monaco.variable },
				{ token: "type", foreground: monaco.type },
			],
			colors,
		},
	};
}

function buildColors(ui: ThemeProps["ui"], monaco: ThemeProps["monaco"]) {
	return {
		"activityBar.background": ui.header,
		"activityBar.foreground": ui.foreground,
		"activityBarBadge.background": ui.accent,
		"activityBarBadge.foreground": ui.foreground,
		// Badges y botones
		"badge.background": ui.header,
		"button.background": ui.header,
		"button.secondaryBackground": ui.border,
		"button.secondaryForeground": ui.foreground,
		"checkbox.border": ui.border,
		// Debug
		"debugToolBar.background": ui.header,
		descriptionForeground: ui.foreground,
		// Diff Editor
		"diffEditor.insertedTextBackground": ui.selection,
		// Dropdowns
		"dropdown.background": ui.header,
		"dropdown.border": ui.border,
		// Editor
		"editor.background": ui.background,
		"editor.findMatchBackground": ui.selection,
		"editor.findMatchBorder": ui.border,
		"editor.findMatchHighlightBackground": ui.selection,
		"editor.foreground": ui.foreground,
		"editorBracketHighlight.foreground1":
			monaco.BracketHighlight1 ?? monaco.function,
		"editorBracketHighlight.foreground2":
			monaco.BracketHighlight2 ?? ui.success,
		"editorBracketHighlight.foreground3": monaco.BracketHighlight3 ?? ui.accent,
		"editorHoverWidget.highlightForeground": ui.accent,
		"editorInlayHint.foreground": ui.muted,
		"editorInlayHint.background": ui.background,
		"editor.lineHighlightBackground": ui.hover,
		"editorLineNumber.activeForeground": ui.foreground,
		"editorGutter.addedBackground": ui.success,
		"editorGutter.deletedBackground": ui.error,
		"editorGutter.modifiedBackground": ui.warning,
		"editorOverviewRuler.addedBackground": ui.success,
		"editorOverviewRuler.deletedBackground": ui.error,
		"editorOverviewRuler.modifiedBackground": ui.warning,
		"editor.selectionBackground": ui.selection,
		"editor.selectionHighlightBackground": ui.selection,
		"editor.selectionHighlightBorder": ui.border,
		"editor.wordHighlightBackground": ui.selection,
		"editor.wordHighlightBorder": ui.border,
		"editor.wordHighlightStrongBackground": ui.selection,
		"editor.wordHighlightStrongBorder": ui.border,
		"editorBracketMatch.background": ui.hover,
		"editorBracketMatch.border": ui.border,
		"editorCursor.background": ui.background,
		"editorCursor.foreground": ui.accent,
		"editorError.foreground": ui.error,
		// Editor Groups & Hover
		"editorGroup.background": ui.background,
		"editorGroup.border": ui.border,
		"editorGroupHeader.tabsBackground": ui.header,
		"editorHoverWidget.background": ui.header,
		"editorHoverWidget.border": ui.border,
		// Indent Guides & Line Numbers
		"editorIndentGuide.activeBackground1": ui.muted,
		"editorIndentGuide.background1": ui.muted,
		"editorLineNumber.foreground": ui.muted,
		"editorMarkerNavigation.background": ui.background,
		"editorRuler.foreground": ui.muted,
		// Suggest Widget
		"editorSuggestWidget.background": ui.header,
		"editorSuggestWidget.border": ui.border,
		"editorSuggestWidget.selectedBackground": ui.selection,
		"editorWarning.foreground": ui.warning,
		"editorWhitespace.foreground": `${ui.muted}20`,
		"editorWidget.background": ui.header,
		focusBorder: ui.border,
		// Git & Input
		"gitDecoration.ignoredResourceForeground": ui.muted,
		"input.background": ui.header,
		"input.foreground": ui.foreground,
		// List & Menu
		"list.activeSelectionBackground": ui.selection,
		"list.activeSelectionForeground": ui.foreground,
		"list.focusBackground": ui.hover,
		"list.focusForeground": ui.foreground,
		"list.highlightForeground": ui.accent,
		"list.hoverBackground": ui.hover,
		"list.hoverForeground": ui.foreground,
		"list.inactiveSelectionBackground": ui.selection,
		"list.inactiveSelectionForeground": ui.foreground,
		"list.warningForeground": ui.warning,
		"menu.foreground": ui.foreground,
		"menu.separatorBackground": ui.border,
		// Minimap
		"minimapGutter.addedBackground": ui.success,
		"minimapGutter.deletedBackground": ui.error,
		"minimapGutter.modifiedBackground": ui.warning,
		// Panel & Peek View
		"panel.border": ui.border,
		"panelSectionHeader.background": ui.header,
		"peekViewEditor.background": ui.background,
		"peekViewEditor.matchHighlightBackground": ui.selection,
		"peekViewResult.background": ui.header,
		// Scrollbar
		"scrollbar.shadow": ui.border,
		"scrollbarSlider.activeBackground": ui.selection,
		"scrollbarSlider.background": ui.hover,
		"scrollbarSlider.hoverBackground": ui.selection,
		// Settings
		"settings.focusedRowBackground": ui.selection,
		"settings.headerForeground": ui.foreground,
		// Side Bar
		"sideBar.background": ui.header,
		"sideBar.foreground": ui.foreground,
		"sideBarSectionHeader.background": ui.header,
		"sideBarSectionHeader.foreground": ui.foreground,
		// Status Bar
		"statusBar.background": ui.header,
		"statusBar.debuggingBackground": ui.warning,
		"statusBar.debuggingBorder": ui.border,
		"statusBar.debuggingForeground": ui.foreground,
		"statusBar.foreground": ui.foreground,
		"statusBar.noFolderBackground": ui.header,
		"statusBarItem.remoteBackground": ui.accent,
		"statusBarItem.remoteForeground": ui.foreground,
		// Tabs
		"tab.activeBackground": ui.background,
		"tab.activeBorder": ui.border,
		"tab.activeForeground": ui.foreground,
		"tab.border": ui.border,
		"tab.hoverBackground": ui.hover,
		"tab.inactiveBackground": ui.header,
		// Text & Title Bar
		"textBlockQuote.background": ui.hover,
		"textBlockQuote.border": ui.border,
		"textLink.foreground": ui.accent,
		"textPreformat.foreground": ui.muted,
		"titleBar.activeBackground": ui.header,
		"titleBar.activeForeground": ui.foreground,
		"titleBar.inactiveBackground": ui.header,
		"titleBar.inactiveForeground": ui.muted,
		// Tree & Walkthrough
		"tree.indentGuidesStroke": ui.muted,
		"walkThrough.embeddedEditorBackground": ui.background,
		// Welcome Page
		"welcomePage.buttonHoverBackground": ui.hover,
	};
}
