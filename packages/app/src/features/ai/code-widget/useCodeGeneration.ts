import type { editor } from "monaco-editor";
import { toast } from "sonner";
import { aiGenerate } from "../lib/ai";
import { cleanCodeResponse } from "../lib/code-utils";

// Use Monaco's built-in types
type Editor = editor.IStandaloneCodeEditor;

// Custom hook for code generation
export function useCodeGeneration(editor: Editor) {
	const generateCode = async (
		description: string,
		onSuccess: (code: string) => void,
		onError?: (error: string) => void,
	) => {
		if (!description.trim()) {
			toast.error("Please enter a description", { position: "top-center" });
			return;
		}

		try {
			// Build enhanced prompt with file context
			const model = editor.getModel();
			const fullCode = model?.getValue() || "";
			const selection = editor.getSelection();
			let selectedCode = "";
			if (selection && !selection.isEmpty()) {
				selectedCode = model?.getValueInRange(selection) || "";
			}

			const language = model?.getLanguageId() || "typescript";

			const prompt =
				"Generate " +
				language +
				" code based on the following description.\n\n" +
				(fullCode
					? "Current file context:\n```" +
						language +
						"\n" +
						fullCode +
						"\n```\n\n"
					: "") +
				(selectedCode
					? "Selected code to modify or extend:\n```" +
						language +
						"\n" +
						selectedCode +
						"\n```\n\n"
					: "") +
				"Description: " +
				description +
				"\n\nProvide only the code without explanation. Ensure the code follows best practices for " +
				language +
				".";

			const cleanCode = cleanCodeResponse(await aiGenerate(prompt));
			onSuccess(cleanCode);
			toast.success("Code generated successfully");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Code generation failed";
			toast.error(errorMessage);
			console.error(error);
			onError?.(errorMessage);
		}
	};

	return { generateCode };
}
