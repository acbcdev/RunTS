import { describe, expect, it, vi } from "vitest";
import { syncEditorScroll } from "./syncEditorScroll";

function createEditor(heights = Array<number>(60).fill(20)) {
	let scrollTop = 0;
	const scrollListeners = new Set<
		(event: { scrollTopChanged: boolean }) => void
	>();
	const contentListeners = new Set<() => void>();
	const layoutListeners = new Set<() => void>();
	const top = (line: number) =>
		heights.slice(0, line - 1).reduce((a, b) => a + b, 0);
	const subscribe = <T>(listeners: Set<T>, listener: T) => {
		listeners.add(listener);
		return { dispose: () => listeners.delete(listener) };
	};
	const instance = {
		getModel: () => ({ getLineCount: () => heights.length }),
		saveViewState: () => ({
			viewState: {
				firstPosition: {
					lineNumber:
						heights.findIndex((height, i) => top(i + 1) + height > scrollTop) +
						1,
				},
			},
		}),
		getVisibleRanges: () => [
			{
				startLineNumber:
					heights.findIndex((_, i) => top(i + 1) >= scrollTop) + 1,
			},
		],
		getScrollTop: () => scrollTop,
		getTopForLineNumber: top,
		getBottomForLineNumber: (line: number) => top(line) + heights[line - 1],
		setScrollTop: vi.fn((value: number) => {
			if (scrollTop === value) return;
			scrollTop = value;
			for (const listener of scrollListeners)
				listener({ scrollTopChanged: true });
		}),
		onDidScrollChange: (
			listener: (event: { scrollTopChanged: boolean }) => void,
		) => subscribe(scrollListeners, listener),
		onDidChangeModelContent: (listener: () => void) =>
			subscribe(contentListeners, listener),
		onDidLayoutChange: (listener: () => void) =>
			subscribe(layoutListeners, listener),
	};
	return {
		...instance,
		editor: instance as unknown as Parameters<typeof syncEditorScroll>[0],
		horizontalScroll: () => {
			for (const listener of scrollListeners)
				listener({ scrollTopChanged: false });
		},
		contentChanged: () => {
			for (const listener of contentListeners) listener();
		},
		layoutChanged: () => {
			for (const listener of layoutListeners) listener();
		},
	};
}

describe("syncEditorScroll", () => {
	it("aligns on mount and scrolls both ways without feedback", () => {
		const code = createEditor();
		const output = createEditor();
		code.setScrollTop(120);
		syncEditorScroll(code.editor, output.editor);
		expect(output.getScrollTop()).toBe(120);
		code.setScrollTop.mockClear();
		output.setScrollTop.mockClear();
		code.setScrollTop(200);
		expect(output.getScrollTop()).toBe(200);
		expect(code.setScrollTop).toHaveBeenCalledTimes(1);
		expect(output.setScrollTop).toHaveBeenCalledTimes(1);
		output.setScrollTop(400);
		expect(code.getScrollTop()).toBe(400);
		expect(code.setScrollTop).toHaveBeenCalledTimes(2);
		expect(output.setScrollTop).toHaveBeenCalledTimes(2);
	});

	it("keeps the same logical line when earlier output lines wrap", () => {
		const code = createEditor();
		const output = createEditor([20, 80, ...Array<number>(58).fill(20)]);
		syncEditorScroll(code.editor, output.editor);
		code.setScrollTop(200);
		expect(output.getScrollTop()).toBe(260);
		expect(output.getVisibleRanges()[0].startLineNumber).toBe(11);
		output.setScrollTop(360);
		expect(code.getScrollTop()).toBe(300);
	});

	it("maps progress within a wrapped line in either direction", () => {
		const code = createEditor();
		const output = createEditor([20, 80, ...Array<number>(58).fill(20)]);
		syncEditorScroll(code.editor, output.editor);
		code.setScrollTop(30);
		expect(output.getScrollTop()).toBe(60);
		output.setScrollTop(80);
		expect(code.getScrollTop()).toBe(35);
	});

	it("ignores horizontal scrolling", () => {
		const code = createEditor();
		const output = createEditor();
		syncEditorScroll(code.editor, output.editor);
		output.setScrollTop.mockClear();
		code.horizontalScroll();
		expect(output.setScrollTop).not.toHaveBeenCalled();
	});

	it("preserves the partially visible top line instead of jumping to the next full line", () => {
		const code = createEditor();
		const output = createEditor();
		syncEditorScroll(code.editor, output.editor);
		output.setScrollTop(213);
		expect(output.getVisibleRanges()[0].startLineNumber).toBe(12);
		expect(code.getScrollTop()).toBe(213);
		code.setScrollTop(107);
		expect(output.getScrollTop()).toBe(107);
	});

	it("realigns after output updates and panel resizing", () => {
		const code = createEditor();
		const heights = Array<number>(60).fill(20);
		const output = createEditor(heights);
		syncEditorScroll(code.editor, output.editor);
		code.setScrollTop(200);
		heights[1] = 80;
		output.contentChanged();
		expect(output.getScrollTop()).toBe(260);
		heights[1] = 120;
		output.layoutChanged();
		expect(output.getScrollTop()).toBe(300);
	});

	it("clamps to the target's last line when its model is shorter", () => {
		const code = createEditor();
		const output = createEditor([20, 20]);
		syncEditorScroll(code.editor, output.editor);
		code.setScrollTop(200);
		expect(output.getScrollTop()).toBe(20);
		expect(code.getScrollTop()).toBe(200);
	});

	it("removes all subscriptions when the console unmounts or sync is disabled", () => {
		const code = createEditor();
		const output = createEditor();
		const dispose = syncEditorScroll(code.editor, output.editor);
		dispose();
		code.setScrollTop(200);
		code.contentChanged();
		code.layoutChanged();
		expect(output.getScrollTop()).toBe(0);
		output.setScrollTop(100);
		output.contentChanged();
		output.layoutChanged();
		expect(code.getScrollTop()).toBe(200);
	});
});
