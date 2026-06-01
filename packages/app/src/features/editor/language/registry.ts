export type LanguageId = "typescript" | "javascript" | "markdown" | "plaintext";

export type OutputPanel = "console" | "preview" | "none";

export interface LanguageDef {
	id: LanguageId;
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
		monaco: "typescript",
		execute: true,
		panel: "console",
	},
	javascript: {
		id: "javascript",
		monaco: "javascript",
		execute: true,
		panel: "console",
	},
	markdown: {
		id: "markdown",
		monaco: "markdown",
		execute: false,
		panel: "preview",
	},
	plaintext: {
		id: "plaintext",
		monaco: "plaintext",
		execute: false,
		panel: "none",
	},
};
