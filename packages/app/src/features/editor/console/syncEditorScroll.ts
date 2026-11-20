import type { editor } from "monaco-editor";

type ScrollEditor = Pick<
	editor.IStandaloneCodeEditor,
	| "getModel"
	| "saveViewState"
	| "getScrollTop"
	| "getTopForLineNumber"
	| "getBottomForLineNumber"
	| "setScrollTop"
	| "onDidScrollChange"
	| "onDidChangeModelContent"
	| "onDidLayoutChange"
>;

export function syncEditorScroll(code: ScrollEditor, console: ScrollEditor) {
	let syncing = false;
	function sync(source: ScrollEditor, target: ScrollEditor) {
		if (syncing) return;
		// getVisibleRanges excludes partially visible lines at the top.
		const sourceLine =
			source.saveViewState()?.viewState.firstPosition.lineNumber;
		const targetModel = target.getModel();
		if (!sourceLine || !targetModel) return;

		const line = Math.min(sourceLine, targetModel.getLineCount());
		const sourceTop = source.getTopForLineNumber(sourceLine);
		const sourceHeight = source.getBottomForLineNumber(sourceLine) - sourceTop;
		const targetTop = target.getTopForLineNumber(line);
		const targetHeight = target.getBottomForLineNumber(line) - targetTop;
		const fraction =
			sourceHeight > 0
				? Math.max(
						0,
						Math.min(1, (source.getScrollTop() - sourceTop) / sourceHeight),
					)
				: 0;

		// Monaco fires scroll events synchronously, including programmatic scrolling.
		syncing = true;
		target.setScrollTop(targetTop + fraction * targetHeight);
		syncing = false;
	}

	const subscriptions = [
		code.onDidScrollChange((event) => {
			if (event.scrollTopChanged) sync(code, console);
		}),
		console.onDidScrollChange((event) => {
			if (event.scrollTopChanged) sync(console, code);
		}),
		code.onDidChangeModelContent(() => sync(code, console)),
		console.onDidChangeModelContent(() => sync(code, console)),
		code.onDidLayoutChange(() => sync(code, console)),
		console.onDidLayoutChange(() => sync(code, console)),
	];
	sync(code, console);
	return () => {
		for (const subscription of subscriptions) subscription.dispose();
	};
}
