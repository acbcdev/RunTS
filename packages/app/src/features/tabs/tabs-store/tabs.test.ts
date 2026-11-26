import { beforeEach, describe, expect, it } from "vitest";
import { langFromName } from "@/features/editor/language/langFromName";
import { useHistoryTabsStore } from "../history";
import { useTabsStore } from "./tabs";

const baseTab = {
	name: "",
	log: "",
};

describe("tabs store removeTab", () => {
	beforeEach(() => {
		useTabsStore.setState({
			tabs: [],
			activeTabId: "",
			activeTabHistory: [],
		});
		useHistoryTabsStore.setState({ tabs: [] });
	});

	it("sends the removed tab to history when it has code", () => {
		useTabsStore.getState().appendTab({ ...baseTab, code: "console.log(1)" });
		const tab = useTabsStore.getState().getCurrentTab();
		if (!tab) throw new Error("tab not created");

		useTabsStore.getState().removeTab(tab.id);

		expect(useHistoryTabsStore.getState().tabs).toEqual([tab]);
		expect(useTabsStore.getState().tabs).toEqual([]);
	});

	it("does not send the removed tab to history when code is empty", () => {
		useTabsStore.getState().appendTab({ ...baseTab, code: "  " });
		const tab = useTabsStore.getState().getCurrentTab();
		if (!tab) throw new Error("tab not created");

		useTabsStore.getState().removeTab(tab.id);

		expect(useHistoryTabsStore.getState().tabs).toEqual([]);
	});

	it("selects the remaining tab after consecutive closes", () => {
		useTabsStore.getState().appendTab({ name: "A" });
		const first = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().appendTab({ name: "B" });
		const second = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().appendTab({ name: "C" });
		const third = useTabsStore.getState().getCurrentTab()!;

		useTabsStore.getState().removeTab(third.id);
		useTabsStore.getState().removeTab(second.id);

		expect(useTabsStore.getState().getCurrentTab()).toEqual(first);
		expect(useTabsStore.getState().activeTabHistory).toEqual([first.id]);
	});

	it("keeps the active tab when closing an inactive tab", () => {
		useTabsStore.getState().appendTab({ name: "A" });
		const first = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().appendTab({ name: "B" });
		const second = useTabsStore.getState().getCurrentTab()!;

		useTabsStore.getState().removeTab(first.id);

		expect(useTabsStore.getState().getCurrentTab()).toEqual(second);
		expect(useTabsStore.getState().activeTabHistory).toEqual([second.id]);
	});

	it("clears the selection after closing the last tab", () => {
		useTabsStore.getState().appendTab({ name: "A" });
		const tab = useTabsStore.getState().getCurrentTab()!;

		useTabsStore.getState().removeTab(tab.id);

		expect(useTabsStore.getState().tabs).toEqual([]);
		expect(useTabsStore.getState().activeTabId).toBe("");
		expect(useTabsStore.getState().activeTabHistory).toEqual([]);
		expect(useTabsStore.getState().getCurrentTab()).toBeUndefined();
	});

	it("still updates activeTabId after removing the active tab", () => {
		useTabsStore.getState().appendTab({ ...baseTab, code: "a" });
		const first = useTabsStore.getState().getCurrentTab();
		useTabsStore.getState().appendTab({ ...baseTab, code: "b" });
		const second = useTabsStore.getState().getCurrentTab();
		if (!first || !second) throw new Error("tabs not created");

		useTabsStore.getState().removeTab(second.id);

		expect(useTabsStore.getState().activeTabId).toBe(first.id);
		expect(useTabsStore.getState().tabs).toEqual([first]);
	});
});

describe("closed tab history", () => {
	beforeEach(() => {
		useTabsStore.setState({ tabs: [], activeTabId: "", activeTabHistory: [] });
		useHistoryTabsStore.setState({ tabs: [] });
	});

	it("restores successive closes without changing earlier history snapshots", () => {
		useTabsStore.getState().appendTab({ name: "", code: "first" });
		const first = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().appendTab({ name: "second.js", code: "second" });
		const second = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().removeTab(first.id);
		useTabsStore.getState().removeTab(second.id);
		const snapshot = useHistoryTabsStore.getState().tabs;

		const restoredSecond = useHistoryTabsStore.getState().undoClose()!;
		useTabsStore.getState().restoreTab(restoredSecond);
		expect(useTabsStore.getState().getCurrentTab()).toMatchObject({
			name: "second.js",
			code: "second",
		});
		expect(langFromName(useTabsStore.getState().getCurrentTab()!.name).id).toBe(
			"javascript",
		);
		const restoredFirst = useHistoryTabsStore.getState().undoClose()!;
		useTabsStore.getState().restoreTab(restoredFirst);

		expect(useTabsStore.getState().getCurrentTab()).toMatchObject({
			name: "",
			code: "first",
		});
		expect(langFromName(useTabsStore.getState().getCurrentTab()!.name).id).toBe(
			"typescript",
		);
		expect(useHistoryTabsStore.getState().tabs).toEqual([]);
		expect(snapshot).toEqual([first, second]);
	});
});

describe("tab navigation", () => {
	beforeEach(() => {
		useTabsStore.setState({ tabs: [], activeTabId: "", activeTabHistory: [] });
	});

	it("handles zero and one tab in both directions", () => {
		useTabsStore.getState().handleTab(-1);
		useTabsStore.getState().handleTab(1);
		expect(useTabsStore.getState().getCurrentTab()).toBeUndefined();
		useTabsStore.getState().appendTab({ code: "work" });
		const tab = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().handleTab(-1);
		useTabsStore.getState().handleTab(1);
		expect(useTabsStore.getState().getCurrentTab()).toEqual(tab);
		expect(langFromName(tab.name).id).toBe("typescript");
	});

	it("wraps in both directions", () => {
		useTabsStore.getState().appendTab({ name: "first" });
		const first = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().appendTab({ name: "second" });
		const second = useTabsStore.getState().getCurrentTab()!;
		useTabsStore.getState().handleTab(1);
		expect(useTabsStore.getState().getCurrentTab()).toEqual(first);
		useTabsStore.getState().handleTab(-1);
		expect(useTabsStore.getState().getCurrentTab()).toEqual(second);
	});
});
