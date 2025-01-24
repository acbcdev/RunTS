import type { ConsoleOutput } from "@/types/worker";
import WorkerJS from "@/workers/runCode?worker";

type RunCodeOptions = {
  injectLogs: boolean;
  name: string;
  timeoutWorker: number;
};

export function runCode(
  code: string,
  options: Partial<RunCodeOptions>
): Promise<ConsoleOutput[]> {
  return new Promise((resolve, reject) => {
    const worker = new WorkerJS({ name: "runCode" });
    const timeout = setTimeout(() => {
      reject(new Error("El Worker excedió el tiempo de espera."));
      worker.terminate();
    }, options.timeoutWorker || 10000);

    // Enviar mensaje al Worker
    worker.postMessage({
      activeTabCode: code,
      nam: options.name,
      injectLogs: options.injectLogs,
    });

    // Manejar mensajes del Worker
    worker.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);
      resolve(event.data);
      worker.terminate();
    };

    worker.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);
      resolve(event.data);
      worker.terminate();
    };
  });
}
