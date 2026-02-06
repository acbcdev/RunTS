export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface DangerousPattern {
  pattern: RegExp;
  message: string;
}

const DANGEROUS_PATTERNS: DangerousPattern[] = [
  {
    pattern: /\bObject\.getOwnPropertyNames\s*\(/,
    message: "Object.getOwnPropertyNames is not allowed",
  },
  {
    pattern: /\bObject\.getPrototypeOf\s*\(/,
    message: "Object.getPrototypeOf is not allowed",
  },
  {
    pattern: /\bObject\.getOwnPropertyDescriptor\s*\(/,
    message: "Object.getOwnPropertyDescriptor is not allowed",
  },
  {
    pattern: /\bFunction\s*\(/,
    message: "Dynamic Function creation is not allowed",
  },
  {
    pattern: /\beval\s*\(/,
    message: "eval() is not allowed",
  },
  {
    pattern: /\bimportScripts\s*\(/,
    message: "importScripts is not allowed in user code",
  },
  {
    pattern: /\bpostMessage\s*\(/,
    message: "postMessage is not allowed",
  },
  {
    pattern:
      /\bself\.(?!console|setTimeout|clearTimeout|setInterval|clearInterval|undefined|location|isFinite|isNaN|parseFloat|parseInt)/,
    message: "Direct access to worker scope is restricted",
  },
];

const MAX_CODE_LENGTH = 1_000_000;

export function validateCode(code: string): ValidationResult {
  const errors: string[] = [];

  // Check length
  if (code.length > MAX_CODE_LENGTH) {
    errors.push(
      `Code exceeds maximum length of ${MAX_CODE_LENGTH} bytes (current: ${code.length})`,
    );
    return { valid: false, errors };
  }

  // Check for dangerous patterns
  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      errors.push(message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function wrapCodeForExecution(code: string): string {
  return `try {
${code
  .split("\n")
  .map((line) => `\t${line}`)
  .join("\n")}
} catch (error) {
\tconsole.error("Execution error:", error instanceof Error ? error.message : String(error));
}`;
}
