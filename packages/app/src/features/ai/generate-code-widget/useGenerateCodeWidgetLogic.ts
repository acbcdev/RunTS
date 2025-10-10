import type { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { useAIConfigStore } from "../store/aiConfig";
import { useCodeGeneration } from "./useCodeGeneration";

// Use Monaco's built-in types
type Editor = editor.IStandaloneCodeEditor;

// Custom hook for generate code widget logic
export function useGenerateCodeWidgetLogic(
  editor: Editor,
  onClose: () => void,
  onGenerate: (code: string) => void
) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { generateCode } = useCodeGeneration(editor);

  const handleGenerate = async () => {
    const selectedModel = useAIConfigStore.getState().selectedModel;
    setIsLoading(true);
    try {
      await generateCode(
        description,
        `${selectedModel.provider}/${selectedModel.id}`,
        (code) => {
          onGenerate(code);
          onClose();
        },
        () => {
          // Error handling is done in generateCode
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    description,
    setDescription,
    isLoading,
    handleGenerate,
  };
}
