import * as Babel from "@babel/standalone";

export function transform(code: string, name?: string) {
	const filename = name ? `${name.replace(/\s+/g, "-")}.ts` : "code.ts";
	return Babel.transform(code, {
		presets: ["typescript"],
		filename,
		sourceType: "module",
		retainLines: true,
	}).code;
}
