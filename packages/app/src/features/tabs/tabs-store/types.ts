import type { Tab } from "@/features/editor/types";

interface TabsStoreState {
	tabs: Tab[];
	activeTabId: Tab["id"];
	activeTabHistory: Tab["id"][];
}
type TabsStoreActions = {
	setActiveTab: (id: Tab["id"]) => void;
	getCurrentTab: () => Tab | undefined;
	removeTab: (id: Tab["id"]) => void;
	appendTab: (
		data?: Partial<Omit<Tab, "id" | "createdAt" | "updatedAt">>,
	) => void;
	newTab: (data?: Partial<Omit<Tab, "id" | "createdAt" | "updatedAt">>) => void;
	restoreTab: (tab: Tab) => void;
	setEditing: (id: Tab["id"], editing?: boolean) => void;
	getTab: (id: Tab["id"]) => Tab | undefined;
	handleTab: (dir: 1 | -1) => void;
	updateTab: (id: Tab["id"], updates: Partial<Tab>) => void;
};

export type TabsStore = TabsStoreState & TabsStoreActions;
