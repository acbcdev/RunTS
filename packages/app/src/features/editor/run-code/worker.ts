import { injectLogsIntoCode } from "./addLogsToLines";
import { validateCode, wrapCodeForExecution } from "./codeValidator";
import { Formatter } from "./formatter";
import { transform } from "./transform";
import type { ConsoleOutput } from "./types";

self.onmessage = async (event: MessageEvent) => {
  const { activeTabCode, name, injectLogs } = event.data;
  let output: ConsoleOutput[] = [];
  let outputLimitReached = false; // Bandera para limitar el output

  const sourceMap = new Map<number, { line: number; column: number }>();

  const originalConsole = {
    log: self.console.log,
    error: self.console.error,
    info: self.console.info,
    warn: self.console.warn,
  };

  // Track pending async operations
  const pendingTimeouts = new Set<number>();
  const originalSetTimeout = self.setTimeout;
  const originalClearTimeout = self.clearTimeout;

  // Override setTimeout to track pending operations
  const selfTyped = self as unknown as {
    setTimeout: (
      callback: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ) => number;
    clearTimeout: (id?: number) => void;
  };

  selfTyped.setTimeout = (
    callback: (...args: unknown[]) => void,
    delay?: number,
    ...args: unknown[]
  ) => {
    const id = originalSetTimeout(() => {
      pendingTimeouts.delete(id);
      callback(...args);
      checkIfDone();
    }, delay);
    pendingTimeouts.add(id);
    return id;
  };

  // Override clearTimeout to stop tracking cancelled timeouts
  selfTyped.clearTimeout = (id?: number) => {
    if (id !== undefined) {
      pendingTimeouts.delete(id);
      originalClearTimeout(id);
    }
  };

  const checkOutputLimit = () => {
    if (output.length >= 4000) {
      if (!outputLimitReached) {
        output.push({
          type: "log",
          content:
            "Output limit reached: No more logs will be recorded. max 4000",
          line: 0,
          column: 0,
          timestamp: Date.now(),
        });
        outputLimitReached = true;
      }
      finishExecution();
      return true; // Indica que se alcanzó el límite
    }
    return false; // No se alcanzó el límite
  };

  const finishExecution = () => {
    // Restore original setTimeout/clearTimeout
    self.setTimeout = originalSetTimeout;
    self.clearTimeout = originalClearTimeout;
    // Restore original console methods
    self.console.log = originalConsole.log;
    self.console.error = originalConsole.error;
    self.console.info = originalConsole.info;
    self.console.warn = originalConsole.warn;
    // Send result
    self.postMessage(output);
  };

  const checkIfDone = () => {
    // If no pending timeouts and not output limit reached, we're done
    if (pendingTimeouts.size === 0 && !outputLimitReached) {
      finishExecution();
    }
  };

  try {
    // Babel.registerPlugin("injectLogs", injectLogsPlugin);
    // console.log(activeTabCode, "activeTabCode");
    const transpiledCode = transform(activeTabCode, name);

    // console.log(transpiledCode);
    const { code, lines } = injectLogsIntoCode(transpiledCode ?? "", {
      injectLogs: injectLogs,
    });
    // console.log(code);
    lines.forEach((line, index) => {
      sourceMap.set(index, { line, column: 0 });
    });
    let consolePosition = 0;

    self.console.clear = () => {
      output = [];
    };
    const log = (...args: unknown[]) => {
      if (!checkOutputLimit()) {
        const position = sourceMap.get(consolePosition);
        output.push({
          type: "log",
          content: args.map((arg) => Formatter(arg)).join(" "),
          line: position?.line || 0,
          column: position?.column || 0,
          timestamp: Date.now(),
        });
        consolePosition++;
      }
    };

    self.console.log = log;
    self.console.error = log;
    self.console.info = log;
    self.console.warn = log;

    if (outputLimitReached) {
      finishExecution();
      return;
    }

    const validation = validateCode(code ?? "");
    if (!validation.valid) {
      output.push({
        type: "log",
        content: `Validation Error: ${validation.errors.join("; ")}`,
        line: 0,
        column: 0,
        timestamp: Date.now(),
      });
      finishExecution();
      return;
    }

    const wrappedCode = wrapCodeForExecution(code ?? "");
    new Function(wrappedCode)();

    // Check if we're done immediately (no pending async operations)
    checkIfDone();
  } catch (error) {
    if (!outputLimitReached) {
      output.push({
        type: "log",
        content: `Runtime Error: ${error ?? "Unknown error"}`,
        line: 0,
        column: 0,
        timestamp: Date.now(),
      });
    }
    finishExecution();
  }
};
