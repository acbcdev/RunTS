import prettier from "prettier/standalone";
import typescriptParser from "prettier/plugins/typescript";
import estreeParser from "prettier/plugins/estree";
import babelParser from "prettier/plugins/babel";

export interface PrettierFormatOptions {
	printWidth: number;
	tabWidth: number;
	useTabs: boolean;
}

export async function formatCode(
	code: string,
	options: PrettierFormatOptions,
): Promise<string> {
	try {
		const formatted = await prettier.format(code, {
			parser: "typescript",
			plugins: [typescriptParser, estreeParser, babelParser],
			printWidth: options.printWidth,
			tabWidth: options.tabWidth,
			useTabs: !options.useTabs,
			semi: true,
			singleQuote: false,
			trailingComma: "all",
			arrowParens: "always",
		});
		return formatted;
	} catch (error) {
		console.error("Prettier formatting error:", error);
		return code;
	}
}
