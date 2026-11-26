import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import { useEditorStore } from "../editor-store";
import { runTab } from "../run-code";
import { runCode } from "./useRun";

vi.mock("../run-code", () => ({ runTab: vi.fn() }));

beforeEach(() => {
	vi.useFakeTimers();
	vi.resetAllMocks();
	useEditorStore.getState().resetEditor();
	useTabsStore.setState({ tabs: [], activeTabId: "", activeTabHistory: [] });
	useTabsStore.getState().newTab({ name: "test.ts", code: "old" });
});

afterEach(() => vi.useRealTimers());

describe("Execute coordination", () => {
	it("keeps the latest result and running state when runs finish out of order", async () => {
		let finishOld!: (value: Awaited<ReturnType<typeof runTab>>) => void;
		let finishNew!: (value: Awaited<ReturnType<typeof runTab>>) => void;
		vi.mocked(runTab)
			.mockReturnValueOnce(
				new Promise((resolve) => {
					finishOld = resolve;
				}),
			)
			.mockReturnValueOnce(
				new Promise((resolve) => {
					finishNew = resolve;
				}),
			);
		const oldRun = runCode();
		useTabsStore
			.getState()
			.updateTab(useTabsStore.getState().activeTabId, { code: "new" });
		const newRun = runCode();
		await vi.advanceTimersByTimeAsync(500);
		finishOld({ log: "old", consoleOutput: [] });
		await oldRun;
		expect(useEditorStore.getState().running).toBe(true);
		finishNew({ log: "new", consoleOutput: [] });
		await newRun;
		expect(useTabsStore.getState().getCurrentTab()?.log).toBe("new");
		expect(useEditorStore.getState().running).toBe(false);
	});
	it("invalidates a pending result and indicator when the tab becomes non-executable", async () => {
		let finish!: (value: Awaited<ReturnType<typeof runTab>>) => void;
		vi.mocked(runTab).mockReturnValueOnce(
			new Promise((resolve) => {
				finish = resolve;
			}),
		);
		const execution = runCode();
		await vi.advanceTimersByTimeAsync(500);
		const id = useTabsStore.getState().activeTabId;
		useTabsStore.getState().updateTab(id, { name: "notes.md" });
		expect(useEditorStore.getState().running).toBe(false);
		useTabsStore.getState().updateTab(id, { name: "test.ts" });
		finish({ log: "stale", consoleOutput: [] });
		await execution;
		expect(useTabsStore.getState().getTab(id)?.log).toBe("");
	});

	it("discards a pending result when its tab is closed", async () => {
		let finish!: (value: Awaited<ReturnType<typeof runTab>>) => void;
		vi.mocked(runTab).mockReturnValueOnce(
			new Promise((resolve) => {
				finish = resolve;
			}),
		);
		const id = useTabsStore.getState().activeTabId;
		const execution = runCode();
		await vi.advanceTimersByTimeAsync(500);
		useTabsStore.getState().removeTab(id);
		expect(useEditorStore.getState().running).toBe(false);
		finish({ log: "stale", consoleOutput: [] });
		await execution;
		expect(useTabsStore.getState().getTab(id)).toBeUndefined();
	});
});
