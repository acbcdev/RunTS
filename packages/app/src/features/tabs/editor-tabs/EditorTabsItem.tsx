import { X } from "lucide-react";
import { langFromName } from "@/features/editor/language/langFromName";
import type { Tab } from "@/features/editor/types";
import { cn } from "@/features/lib/cn";
import { Button } from "@/features/ui/button";
import { useTabActions } from "../use-tab-actions/useTabActions";
import { TabContextMenu } from "./TabContextMenu";
import { TabName } from "./TabName";

interface EditorTabsItemProps {
	tab: Tab;
}

export function EditorTabsItem({ tab }: EditorTabsItemProps) {
	const {
		tabs,
		activeTabId,
		handleActiveTabChange,
		handleDuplicateTab,
		handleConvertLanguage,
		handleTabNameEdit,
		handleStartEditing,
		handleActivateAndEdit,
		handleRenameFromContextMenu,
		handleCopyCode,
		handleDownloadCode,
		handleShareCode,
		handleRemoveTab,
	} = useTabActions();
	const isActive = activeTabId === tab.id;

	const handleTabClick = () => {
		if (!tab.editing || !isActive) {
			handleActiveTabChange(tab.id);
		}
	};

	const handleCloseTab = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleRemoveTab(tab.id);
	};

	const handleFinishEditing = (newName: string) => {
		handleTabNameEdit(tab.id, newName);
	};

	const handleStartEditingTab = () => {
		// Si el tab no está activo, activarlo primero
		if (!isActive) {
			handleActivateAndEdit(tab.id);
		} else {
			handleStartEditing(tab.id);
		}
	};

	const handleRenameFromMenu = () => {
		// Usar la función específica para context menu que maneja mejor los delays
		handleRenameFromContextMenu(tab.id);
	};

	return (
		<TabContextMenu
			currentLanguage={langFromName(tab.name).id}
			onRename={handleRenameFromMenu}
			onDuplicate={() => handleDuplicateTab(tab.id)}
			onConvert={(langId) => handleConvertLanguage(tab.id, langId)}
			onCopy={() => handleCopyCode(tab.id)}
			onDownload={() => handleDownloadCode(tab.id)}
			onShare={() => handleShareCode(tab.id)}
			onDelete={() => handleRemoveTab(tab.id)}
		>
			<div
				className={cn(
					"group/tab flex items-center gap-x-1 border-r px-3 py-1.5 transition-colors",
					isActive && "bg-border/80",
				)}
			>
				{tab.editing ? (
					<TabName
						tab={tab}
						isActive={isActive}
						onFinishEditing={handleFinishEditing}
						onStartEditing={handleStartEditingTab}
					/>
				) : (
					<button
						type="button"
						aria-pressed={isActive}
						onClick={handleTabClick}
						className="focus:outline-1 focus:outline-ring"
					>
						<TabName
							tab={tab}
							isActive={isActive}
							onFinishEditing={handleFinishEditing}
							onStartEditing={handleStartEditingTab}
						/>
					</button>
				)}
				{tabs.length > 1 && (
					<Button
						variant="ghost"
						size="icon"
						aria-label={`Close ${tab.name || "tab"}`}
						className="h-5 w-5 p-0 rounded-full transition-all duration-200 -outline-offset-2"
						onClick={handleCloseTab}
					>
						<X className="size-3" />
					</Button>
				)}
			</div>
		</TabContextMenu>
	);
}
