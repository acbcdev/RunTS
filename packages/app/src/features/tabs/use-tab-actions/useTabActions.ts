import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useHandler } from "@/features/common/hooks";
import { useEditorStore } from "@/features/editor/editor-store";
import { langFromName } from "@/features/editor/language/langFromName";
import { type LanguageId, REGISTRY } from "@/features/editor/language/registry";
import type { Tab } from "@/features/editor/types";
import { useTabsStore } from "../tabs-store";
import { swapExtension } from "../utils";

export const useTabActions = () => {
	const editorRef = useEditorStore(useShallow((state) => state.editorRef));
	const tabs = useTabsStore(useShallow((state) => state.tabs));
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));
	const setEditing = useTabsStore(useShallow((state) => state.setEditing));
	const removeTab = useTabsStore(useShallow((state) => state.removeTab));
	const updateTab = useTabsStore(useShallow((state) => state.updateTab));
	const newTab = useTabsStore(useShallow((state) => state.newTab));

	const { handleShare, copyCode, downloadCode } = useHandler();

	const handleActiveTabChange = (tabId: Tab["id"]) => {
		const targetTab = tabs.find((tab) => tab.id === tabId);
		if (!targetTab) return;
		setActiveTab(tabId);
		updateTab(tabId, { code: targetTab.code || "" });
		editorRef?.focus();
	};

	const handleDuplicateTab = (tabId: Tab["id"]) => {
		const duplicateTab = tabs.find((tab) => tab.id === tabId);
		if (!duplicateTab) return;

		newTab({
			name: duplicateTab.name ? `copy-${duplicateTab.name}` : "",
			code: duplicateTab.code,
			log: duplicateTab.log,
		});
	};

	const handleTabNameEdit = (tabId: string, name: string) => {
		// The filename is the single source of truth: respect exactly what the
		// user types. A known extension selects its language, an unknown/missing
		// one falls back to plaintext (handled by langFromName), and an empty
		// input keeps the name empty.
		const trimmedName = name.trim();
		updateTab(tabId, { name: trimmedName });
		setEditing(tabId, false);
		if (trimmedName) toast.success("Tab name changed", { duration: 700 });
	};

	const handleConvertLanguage = (tabId: Tab["id"], langId: LanguageId) => {
		const tab = tabs.find((t) => t.id === tabId);
		if (!tab) return;
		// No-op when the tab is already on the target language.
		if (langFromName(tab.name).id === langId) return;
		updateTab(tabId, {
			name: swapExtension(tab.name ?? "", REGISTRY[langId].ext),
		});
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
				updateTab(tabId, { code: targetTab.code || "" });
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
				updateTab(tabId, { code: targetTab.code || "" });
			}
		}

		// Delay más largo para asegurar que el context menu se cierre completamente
		setTimeout(() => {
			setEditing(tabId, true);
		}, 100);
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
		handleConvertLanguage,
		handleStartEditing,
		handleActivateAndEdit,
		handleRenameFromContextMenu,
		handleCopyCode: copyCode,
		handleDownloadCode: downloadCode,
		handleShareCode: handleShare,
		handleRemoveTab,
		setEditing,
	};
};
