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
