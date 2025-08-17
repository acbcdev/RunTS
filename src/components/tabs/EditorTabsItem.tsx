import { Button } from "@/components/ui/button";
import { useTabActions } from "@/hooks/useTabActions";
import { cn } from "@/lib/utils";
import type { Tab } from "@/types/editor";
import { X } from "lucide-react";
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
		<button
			type="button"
			title={tab.name}
			aria-selected={isActive}
			role="tab"
			className={cn(
				"border-r transition-colors focus-within:ring-0 focus-within:outline-1 focus-within:-outline-offset-1 focus:outline-ring	",
				isActive && "bg-border/30 grow-2",
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
							className="h-5 w-5  p-0 bg-transparent hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all duration-200 "
							onClick={handleCloseTab}
						>
							<X className="size-3" />
						</Button>
					)}
				</div>
			</TabContextMenu>
		</button>
	);
}
