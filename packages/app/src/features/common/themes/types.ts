import type { editor } from "monaco-editor";

export type ThemeProps = {
	name: string;
	base?: editor.BuiltinTheme;
	ui: {
		background: string;
		foreground: string;
		border: string;
		accent: string;
		selection: string;
		header: string;
		hover: string;
		muted: string;
		warning: string;
		error: string;
		success: string;
		info: string;
	};
	/** Per-theme overrides merged over the generated workbench colors. */
	colors?: Record<string, string>;
	/** Extra TextMate rules appended after the generated ones (win on equal specificity). */
	tokenColors?: {
		scope: string[];
		settings: { foreground?: string; fontStyle?: string };
	}[];
	monaco: {
		comment: string;
		keyword: string;
		string: string;
		number: string;
		operator: string;

		function: string;
		variable: string;
		type: string;
		BracketHighlight1?: string;
		BracketHighlight2?: string;
		BracketHighlight3?: string;
	};
};
