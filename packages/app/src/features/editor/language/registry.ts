export type LanguageId = "typescript" | "javascript" | "markdown" | "plaintext";

export type OutputPanel = "console" | "preview" | "none";

export interface LanguageDef {
	id: LanguageId;
	/** Human-readable name shown in menus (e.g. the convert submenu). */
	label: string;
	/** Canonical extension written onto the filename when converting. */
	ext: string;
	/** Monaco language id driven onto the editor buffer. */
	monaco: string;
	/** Whether the code in this language can be executed in the worker. */
	execute: boolean;
	/** Which output panel this language renders alongside the editor. */
	panel: OutputPanel;
}

export const REGISTRY: Record<LanguageId, LanguageDef> = {
	typescript: {
		id: "typescript",
		label: "TypeScript",
		ext: "ts",
		monaco: "typescript",
		execute: true,
		panel: "console",
	},
	javascript: {
		id: "javascript",
		label: "JavaScript",
		ext: "js",
		monaco: "javascript",
		execute: true,
		panel: "console",
	},
	markdown: {
		id: "markdown",
		label: "Markdown",
		ext: "md",
		monaco: "markdown",
		execute: false,
		panel: "preview",
	},
	plaintext: {
		id: "plaintext",
		label: "Text",
		ext: "txt",
		monaco: "plaintext",
		execute: false,
		panel: "none",
	},
};
