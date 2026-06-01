import { type LanguageDef, type LanguageId, REGISTRY } from "./registry";

const EXTENSION_TO_LANGUAGE: Record<string, LanguageId> = {
	ts: "typescript",
	js: "javascript",
	md: "markdown",
};

/**
 * Derive a tab's language from its filename extension.
 *
 * - Unnamed tabs (undefined / "") default to typescript.
 * - Named tabs with an unknown or missing extension fall back to plaintext.
 *   (named-but-unknown !== unnamed)
 */
export function langFromName(name?: string): LanguageDef {
	if (!name) return REGISTRY.typescript;

	const dot = name.lastIndexOf(".");
	// dot === -1: no extension (e.g. "notes"). dot === 0: dotfile (e.g. ".gitignore").
	if (dot <= 0) return REGISTRY.plaintext;

	const ext = name.slice(dot + 1).toLowerCase();
	return REGISTRY[EXTENSION_TO_LANGUAGE[ext] ?? "plaintext"];
}
