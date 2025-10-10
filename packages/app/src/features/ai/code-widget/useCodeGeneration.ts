import { generateText } from "ai";
import type { editor } from "monaco-editor";
import { toast } from "sonner";
import { cleanCodeResponse } from "../lib/code-utils";
import { createProvider } from "../lib/providers";
import { useAIConfigStore } from "../store/aiConfig";

// Use Monaco's built-in types
type Editor = editor.IStandaloneCodeEditor;

// Custom hook for code generation
export function useCodeGeneration(editor: Editor) {
  const generateCode = async (
    description: string,
    selectedModel: string,
    onSuccess: (code: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!description.trim()) {
      toast.error("Please enter a description", { position: "top-center" });
      return;
    }

    if (!selectedModel) {
      toast.error("Please select a model", { position: "top-center" });
      return;
    }

    const apiKeys = useAIConfigStore.getState().apiKeys;

    // Split selectedModel and validate format
    const parts = selectedModel.split("/");
    if (parts.length !== 2) {
      toast.error("Invalid model selection format");
      return;
    }

    const [provider, modelId] = parts;

    if (!provider || !modelId) {
      toast.error("Invalid model selection - missing provider or model ID");
      return;
    }

    // Validate that provider is a valid provider type
    const validProviders = [
      "openai",
      "google",
      "anthropic",
      "mistral",
    ] as const;
    type ValidProvider = (typeof validProviders)[number];
    if (!validProviders.includes(provider as ValidProvider)) {
      toast.error("Invalid provider selection");
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

      const { text } = await generateText({
        model: createProvider(
          provider as (typeof validProviders)[number],
          apiKeys[provider as keyof typeof apiKeys]
        )(modelId),
        prompt,
      });

      const cleanCode = cleanCodeResponse(text);
      onSuccess(cleanCode);
      toast.success("Code generated successfully");
    } catch (error) {
      const errorMessage = "Code generation failed";
      toast.error(errorMessage);
      console.error(error);
      onError?.(errorMessage);
    }
  };

  return { generateCode };
}
