import { injectLogsIntoCode } from "@/lib/addLogsToLines";
import { Formatter } from "@/lib/formatter";
import type { ConsoleOutput } from "@/types/worker";
import * as Babel from "@babel/standalone";
self.onmessage = async (event: MessageEvent) => {
  const { activeTabCode, name } = event.data;
  let output: ConsoleOutput[] = [];
  let outputLimitReached = false; // Bandera para limitar el output

  const sourceMap = new Map<number, { line: number; column: number }>();

  const originalConsole = {
    log: self.console.log,
    error: self.console.error,
    info: self.console.info,
    warn: self.console.warn,
  };

  const checkOutputLimit = () => {
    if (output.length >= 4000) {
      if (!outputLimitReached) {
        output.push({
          type: "warn",
          content:
            "Output limit reached: No more logs will be recorded. max 4000",
          line: 0,
          column: 0,
          timestamp: Date.now(),
        });
        outputLimitReached = true;
      }
      self.postMessage(output); // Enviar resultado
      return true; // Indica que se alcanzó el límite
    }
    return false; // No se alcanzó el límite
  };

  try {
    // console.log(activeTabCode, "activeTabCode");
    const transpiledCode = Babel.transform(activeTabCode, {
      presets: ["typescript"],
      filename: name,
      sourceType: "module",
      retainLines: true,
      compact: false, // Disable compacting
      comments: true, // Preserve comments
      minified: false, // Disable minification
      sourceMaps: "inline",
    }).code;
    // console.log(transpiledCode, "transpiledCode");

    const { code, lines } = injectLogsIntoCode(transpiledCode ?? "");
    lines.forEach((line, index) => {
      sourceMap.set(index, { line, column: 0 });
    });
    let consolePosition = 0;

    self.console.clear = () => {
      output = [];
    };

    self.console.log = (...args) => {
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
    self.console.error = (...args) => {
      if (!checkOutputLimit()) {
        const position = sourceMap.get(consolePosition);
        output.push({
          type: "error",
          content: args.map((arg) => Formatter(arg)).join(" "),
          line: position?.line || 0,
          column: position?.column || 0,
          timestamp: Date.now(),
        });
        consolePosition++;
      }
    };

    self.console.info = (...args) => {
      if (!checkOutputLimit()) {
        const position = sourceMap.get(consolePosition);
        output.push({
          type: "info",
          content: args.map((arg) => Formatter(arg)).join(" "),
          line: position?.line || 0,
          column: position?.column || 0,
          timestamp: Date.now(),
        });
        consolePosition++;
      }
    };

    self.console.warn = (...args) => {
      if (!checkOutputLimit()) {
        const position = sourceMap.get(consolePosition);
        output.push({
          type: "warn",
          content: args.map((arg) => Formatter(arg)).join(" "),
          line: position?.line || 0,
          column: position?.column || 0,
          timestamp: Date.now(),
        });
        consolePosition++;
      }
    };

    if (!outputLimitReached) {
      new Function(code ?? "")();
    }
  } catch (error) {
    if (!outputLimitReached) {
      output.push({
        type: "error",
        content: `Runtime Error: ${error ?? "Unknown error"}`,
        line: 0,
        column: 0,
        timestamp: Date.now(),
      });
    }
  } finally {
    // Restore original console methods
    self.console.log = originalConsole.log;
    self.console.error = originalConsole.error;
    self.console.info = originalConsole.info;
    self.console.warn = originalConsole.warn;

    if (!outputLimitReached) {
      self.postMessage(output); // Enviar resultado final
    }
  }
};
