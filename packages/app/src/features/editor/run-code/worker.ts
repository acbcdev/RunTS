import { captureConsole } from "./captureConsole";
import { preparePipeline } from "./pipeline";

self.onmessage = async (event: MessageEvent) => {
	const { activeTabCode, name, injectLogs } = event.data;
	const capture = captureConsole();
	const originalConsole = self.console;
	const originalSetTimeout = self.setTimeout;
	const originalClearTimeout = self.clearTimeout;
	const pending = new Set<number>();
	let executing = true;
	let finished = false;
	const finish = () => {
		if (executing || pending.size || finished) return;
		finished = true;
		self.console = originalConsole;
		self.setTimeout = originalSetTimeout;
		self.clearTimeout = originalClearTimeout;
		self.postMessage(capture.getOutput());
	};
	self.console = capture.console as Console;
	self.setTimeout = ((
		callback: (...args: unknown[]) => void,
		delay?: number,
		...args: unknown[]
	) => {
		const id = originalSetTimeout(() => {
			pending.delete(id);
			try {
				callback(...args);
			} catch (error) {
				capture.reportError(error);
			} finally {
				finish();
			}
		}, delay);
		pending.add(id);
		return id;
	}) as typeof setTimeout;
	self.clearTimeout = ((id?: number) => {
		if (id !== undefined) {
			pending.delete(id);
			originalClearTimeout(id);
		}
		finish();
	}) as typeof clearTimeout;
	try {
		const pipeline = preparePipeline(activeTabCode, name, injectLogs);
		if (pipeline.ready) {
			await new Function(
				"console",
				pipeline.binding,
				`return (async () => {\n${pipeline.code}\n})();`,
			)(capture.console, capture.at);
		} else capture.reportError(pipeline.error);
	} catch (error) {
		capture.reportError(error);
	} finally {
		executing = false;
		finish();
	}
};
