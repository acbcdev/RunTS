import { useHandler } from "@/hooks/useHandler";
import { useEditorStore } from "@/store/editor";
import { useTabsStore } from "@/store/tabs";
import type { Tab } from "@/types/editor";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export const useTabActions = () => {
	const editorRef = useEditorStore(useShallow((state) => state.editorRef));
	const tabs = useTabsStore(useShallow((state) => state.tabs));
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));
	const setEditing = useTabsStore(useShallow((state) => state.setEditing));
	const removeTab = useTabsStore(useShallow((state) => state.removeTab));
	const changeNameTab = useTabsStore(
		useShallow((state) => state.changeNameTab),
	);
	const updateTabCode = useTabsStore(
		useShallow((state) => state.updateTabCode),
	);
	const addTab = useTabsStore(useShallow((state) => state.addTab));

	const { handleShare, copyCode, downloadCode } = useHandler();

	const handleActiveTabChange = (tabId: Tab["id"]) => {
		const targetTab = tabs.find((tab) => tab.id === tabId);
		if (!targetTab) return;
		setActiveTab(tabId);
		updateTabCode(tabId, targetTab.code || "");
		editorRef?.focus();
	};

	const handleDuplicateTab = (tabId: Tab["id"]) => {
		const duplicateTab = tabs.find((tab) => tab.id === tabId);
		if (!duplicateTab) return;

		addTab({
			name: `copy-${duplicateTab.name}`,
			language: duplicateTab.language,
			code: duplicateTab.code,
			logs: duplicateTab.logs,
			logsFormated: duplicateTab.logsFormated,
		});
	};

	const handleTabNameEdit = (tabId: string, name: string) => {
		if (!name.trim()) {
			changeNameTab(tabId, "code.ts");
			setEditing(tabId, false);
			return;
		}

		const trimmedName = name.trim();
		const hasValidExtension =
			trimmedName.endsWith(".ts") || trimmedName.endsWith(".js");
		const [nameWithoutExtension] = trimmedName.split(/\.$/);
		let finalName = nameWithoutExtension.replace(/\s+/g, "-");

		if (!hasValidExtension) {
			finalName = `${finalName.slice(0, 20)}.ts`;
		}

		changeNameTab(tabId, finalName);
		setEditing(tabId, false);
		toast.success("Tab name changed", { duration: 700 });
	};

	const handleStartEditing = (tabId: string) => {
		setEditing(tabId, true);
	};

	const handleRenameFromContextMenu = (tabId: string) => {
		// Para el context menu, siempre activar y editar con delay
		if (activeTabId !== tabId) {
			const targetTab = tabs.find((tab) => tab.id === tabId);
			if (targetTab) {
				setActiveTab(tabId);
				updateTabCode(tabId, targetTab.code || "");
			}
		}

		// Delay para asegurar que el context menu se cierre y el tab esté activo
		setTimeout(() => {
			setEditing(tabId, true);
		}, 150);
	};

	const handleActivateAndEdit = (tabId: string) => {
		// Primero activar el tab si no está activo
		if (activeTabId !== tabId) {
			const targetTab = tabs.find((tab) => tab.id === tabId);
			if (targetTab) {
				setActiveTab(tabId);
				updateTabCode(tabId, targetTab.code || "");
			}
		}

		// Delay más largo para asegurar que el context menu se cierre completamente
		setTimeout(() => {
			setEditing(tabId, true);
		}, 100);
	};

	const handleCopyCode = (tabId: string) => {
		copyCode(tabId);
	};

	const handleDownloadCode = (tabId: string) => {
		downloadCode(tabId);
	};

	const handleShareCode = (tabId: string) => {
		handleShare(tabId);
	};

	const handleRemoveTab = (tabId: string) => {
		removeTab(tabId);
	};

	return {
		tabs,
		activeTabId,
		handleActiveTabChange,
		handleDuplicateTab,
		handleTabNameEdit,
		handleStartEditing,
		handleActivateAndEdit,
		handleRenameFromContextMenu,
		handleCopyCode,
		handleDownloadCode,
		handleShareCode,
		handleRemoveTab,
		setEditing,
		changeNameTab,
	};
};
