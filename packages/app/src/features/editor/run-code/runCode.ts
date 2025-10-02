import type { ConsoleOutput, RunCodeOptions } from "./types";

export function runCodeWorker(
  code: string,
  options: Partial<RunCodeOptions>
): Promise<ConsoleOutput[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker.ts?worker", import.meta.url), {
      type: "module",
      name: "runCode",
    });
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("El Worker excedió el tiempo de espera."));
    }, options.timeoutWorker || 10000);

    // Enviar mensaje al Worker
    worker.postMessage({
      activeTabCode: code,
      ...options,
    });

    // Manejar mensajes del Worker
    worker.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve(event.data);
    };

    // Manejar errores del Worker
    // worker.onerror = (error: ErrorEvent) => {
    //   clearTimeout(timeout);
    //   worker.terminate();
    //   reject(new Error(`Worker error: ${error.message}`));
    // };
  });
}
