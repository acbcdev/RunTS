import { beforeEach, describe, expect, it } from "vitest";
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
		useTabsStore.getState().appendTab({ ...baseTab, code: "" });
		const tab = useTabsStore.getState().getCurrentTab();
		if (!tab) throw new Error("tab not created");

		useTabsStore.getState().removeTab(tab.id);

		expect(useHistoryTabsStore.getState().tabs).toEqual([]);
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
