/**
 * Utility functions for code processing and manipulation
 */

/**
 * Extracts clean code from AI-generated text response.
 * Removes markdown code block syntax and trims whitespace.
 *
 * @param text - The raw text response from AI
 * @returns Clean code with markdown formatting removed
 *
 * @example
 * ```typescript
 * const response = "```typescript\nconsole.log('hello');\n```";
 * const cleanCode = cleanCodeResponse(response);
 * // Returns: "console.log('hello');"
 * ```
 */
export function cleanCodeResponse(text: string): string {
  // Remove markdown code blocks
  const codeBlockRegex = /```(?:\w+)?\n?([\s\S]*?)```/g;
  const match = codeBlockRegex.exec(text);
  if (match) {
    return match[1].trim();
  }
  // If no code block, return trimmed text
  return text.trim();
}
