import type { ConsoleOutput } from "@/types/worker";

type RunCodeOptions = {
	injectLogs: boolean;
	name: string;
	timeoutWorker: number;
};

// Worker instance for reuse to avoid repeated network requests
let workerInstance: Worker | null = null;

// Queue to handle concurrent requests
let currentExecution: Promise<ConsoleOutput[]> | null = null;

function createWorker(): Worker {
	return new Worker(
		new URL("../workers/runCode.ts?worker", import.meta.url),
		{
			type: "module",
			name: "runCode",
		},
	);
}

export function runCodeWorker(
	code: string,
	options: Partial<RunCodeOptions>,
): Promise<ConsoleOutput[]> {
	// If there's a current execution, wait for it to complete before starting a new one
	if (currentExecution) {
		return currentExecution.then(() => runCodeWorker(code, options));
	}

	currentExecution = new Promise<ConsoleOutput[]>((resolve, reject) => {
		// Create worker if it doesn't exist or has been terminated
		if (!workerInstance) {
			workerInstance = createWorker();
		}

		const timeout = setTimeout(() => {
			reject(new Error("El Worker excedió el tiempo de espera."));
			// Don't terminate the worker on timeout, just reject this execution
		}, options.timeoutWorker || 10000);

		// Handler for this specific execution
		const messageHandler = (event: MessageEvent) => {
			clearTimeout(timeout);
			workerInstance?.removeEventListener('message', messageHandler);
			resolve(event.data);
		};

		// Error handler for this specific execution
		const errorHandler = (error: ErrorEvent) => {
			clearTimeout(timeout);
			workerInstance?.removeEventListener('message', messageHandler);
			workerInstance?.removeEventListener('error', errorHandler);
			// Terminate and recreate worker if there's an error
			workerInstance?.terminate();
			workerInstance = null;
			reject(new Error(`Worker error: ${error.message}`));
		};

		// Add event listeners for this execution
		workerInstance.addEventListener('message', messageHandler);
		workerInstance.addEventListener('error', errorHandler);

		// Send message to worker
		workerInstance.postMessage({
			activeTabCode: code,
			...options,
		});
	}).finally(() => {
		// Clear current execution when done
		currentExecution = null;
	});

	return currentExecution!; // We know it's not null here since we just assigned it
}

// Cleanup function to terminate worker when needed
export function terminateWorker(): void {
	if (workerInstance) {
		workerInstance.terminate();
		workerInstance = null;
	}
}
