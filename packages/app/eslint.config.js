import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist/**", "src-tauri/**", "coverage/**"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, ...globals.worker },
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
		},
	},
);
