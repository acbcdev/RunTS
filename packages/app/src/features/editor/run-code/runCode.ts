import type { ConsoleOutput } from "@/features/editor/types";

type RunCodeOptions = {
	injectLogs: boolean;
	name: string;
	timeoutWorker: number;
	hideUndefined: boolean;
};

export function runCodeWorker(
	code: string,
	options: Partial<RunCodeOptions>,
): Promise<ConsoleOutput[]> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(
			new URL("../workers/runCode.ts?worker", import.meta.url),
			{
				type: "module",
				name: "runCode",
			},
		);
		const timeout = setTimeout(() => {
			reject(new Error("El Worker excedió el tiempo de espera."));
			worker.terminate();
		}, options.timeoutWorker || 10000);

		// Enviar mensaje al Worker
		worker.postMessage({
			activeTabCode: code,
			...options,
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
