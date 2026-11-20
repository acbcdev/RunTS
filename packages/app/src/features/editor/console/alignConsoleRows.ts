import type { editor } from "monaco-editor";

type SourceEditor = Pick<
	editor.IStandaloneCodeEditor,
	| "getTopForLineNumber"
	| "getScrollTop"
	| "setScrollTop"
	| "getContentHeight"
	| "onDidScrollChange"
	| "onDidContentSizeChange"
	| "onDidLayoutChange"
>;

/** Pin each log row to its source line's top and mirror the editor's scroll. */
export function alignConsoleRows(source: SourceEditor, container: HTMLElement) {
	const inner = container.firstElementChild as HTMLElement | null;
	if (!inner) return;
	const layout = () => {
		const lineHeight =
			source.getTopForLineNumber(2) - source.getTopForLineNumber(1);
		if (lineHeight > 0) inner.style.lineHeight = `${lineHeight}px`;
		// flow-root: first row's margin must not collapse through inner, else offsetTop misses it
		inner.style.display = "flow-root";
		inner.style.minHeight = `${source.getContentHeight()}px`;
		const rows = [...inner.querySelectorAll<HTMLElement>("[data-source-line]")];
		for (const row of rows) row.style.marginTop = "0px";
		for (const row of rows) {
			const line = Number(row.dataset.sourceLine);
			if (!line) continue;
			// offsetTop already includes margins set on earlier rows (live layout)
			const margin = Math.max(
				0,
				source.getTopForLineNumber(line) - row.offsetTop,
			);
			row.style.marginTop = `${margin}px`;
		}
		container.scrollTop = source.getScrollTop();
	};
	layout();
	const subs = [
		source.onDidContentSizeChange(layout),
		source.onDidLayoutChange(layout),
		source.onDidScrollChange(() => {
			container.scrollTop = source.getScrollTop();
		}),
	];
	const onScroll = () => source.setScrollTop(container.scrollTop);
	container.addEventListener("scroll", onScroll);
	return () => {
		for (const sub of subs) sub.dispose();
		container.removeEventListener("scroll", onScroll);
	};
}
