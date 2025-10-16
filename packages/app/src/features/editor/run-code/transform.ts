import * as Babel from "@babel/standalone";

export function transform(code: string, name?: string) {
	const transpiledCode = Babel.transform(code, {
		presets: ["typescript"],
		filename: name ?? "code.ts",
		// plugins: ["injectLogs"],
		sourceType: "module",
		retainLines: true,
	}).code;
	return transpiledCode;
}
