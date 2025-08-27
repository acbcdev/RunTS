import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTabActions } from "@/hooks/useTabActions";
import { cn } from "@/lib/utils";
import { useHistoryTabsStore } from "@/store/history";
import type { Tab } from "@/types/editor";
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
		handleTabNameEdit,
		handleStartEditing,
		handleActivateAndEdit,
		handleRenameFromContextMenu,
		handleCopyCode,
		handleDownloadCode,
		handleShareCode,
		handleRemoveTab,
	} = useTabActions();
	const addTab = useHistoryTabsStore((state) => state.addTab);
	const isActive = activeTabId === tab.id;

	const handleTabClick = () => {
		if (!tab.editing || !isActive) {
			handleActiveTabChange(tab.id);
		}
	};

	const handleCloseTab = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (tab.code.trim() !== "") addTab(tab);
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
		<button
			type="button"
			aria-selected={isActive}
			role="tab"
			className={cn(
				"border-r transition-colors focus:ring-0 focus:outline-1 focus:-outline-offset-1 focus:outline-ring",
				isActive ? "bg-border/80" : "",
			)}
			onClick={handleTabClick}
		>
			<TabContextMenu
				onRename={handleRenameFromMenu}
				onDuplicate={() => handleDuplicateTab(tab.id)}
				onCopy={() => handleCopyCode(tab.id)}
				onDownload={() => handleDownloadCode(tab.id)}
				onShare={() => handleShareCode(tab.id)}
				onDelete={() => handleRemoveTab(tab.id)}
			>
				<div className="group/tab flex items-center gap-x-1 px-3 py-1.5">
					<TabName
						tab={tab}
						isActive={isActive}
						onFinishEditing={handleFinishEditing}
						onStartEditing={handleStartEditingTab}
					/>
					{tabs.length > 1 && (
						<Button
							variant="ghost"
							size="icon"
							aria-label="Close tab"
							className="h-5 w-5  p-0 rounded-full transition-all duration-200 -outline-offset-2"
							onClick={handleCloseTab}
							tabIndex={0}
							asChild
						>
							<X className="size-3" />
						</Button>
					)}
				</div>
			</TabContextMenu>
		</button>
	);
}
