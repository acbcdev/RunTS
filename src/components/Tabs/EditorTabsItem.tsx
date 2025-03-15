import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { useHandler } from "@/hooks/useHandler";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor";
import { useTabsStore } from "@/store/tabs";
import type { Tab } from "@/types/editor";
import { X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const TabContextMenuItem = ({
	children,
	tabs,
	tab,
	removeTab,
	setEditing,
	inputRef,
}: {
	children: React.ReactNode;
	tabs: Tab[];
	tab: Tab;
	removeTab: (id: string) => void;
	setEditing: (id: string, value: boolean) => void;
	inputRef: React.RefObject<HTMLInputElement>;
}) => {
	const { handleShare, copyCode, downloadCode } = useHandler();

	const addTab = useTabsStore(useShallow((state) => state.addTab));

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
		// handleActiveTabChange(id);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						setEditing(tab.id, true);
						setTimeout(() => {
							inputRef.current?.focus();
						}, 150);
					}}
				>
					Rename
				</ContextMenuItem>

				<ContextMenuItem onClick={() => handleDuplicateTab(tab.id)}>
					Duplicate
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => {
						copyCode(tab.id);
					}}
				>
					Copy
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						downloadCode(tab.id);
					}}
				>
					Download
				</ContextMenuItem>
				<ContextMenuItem onClick={() => handleShare(tab.id)}>
					Share
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					className="focus:bg-destructive focus:text-destructive-foreground"
					onClick={() => removeTab(tab.id)}
				>
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

const EditorTabItemName = ({
	tab,
	tabs,
	inputRef,
	changeNameTab,
	activeTabId,
	setEditing,
}: {
	tab: Tab;
	tabs: Tab[];
	inputRef: React.RefObject<HTMLInputElement>;
	changeNameTab: (id: string, name: string) => void;
	activeTabId: string;
	setEditing: (id: string, value?: boolean) => void;
}) => {
	const handleTabEdited = (tabId: string) => {
		const tab = tabs.find((tab) => tab.id === tabId);
		if (!tab) return;
		if (!tab.name.trim()) {
			changeNameTab(tabId, "code.ts");
			setEditing(tabId);
			return;
		}
		const name = tab.name.trim();
		const tsFile = name.endsWith(".ts") || name.endsWith(".js");
		const [nameTab] = name.split(/\.$/);
		let changeName = nameTab.replace(/\s+/g, "-");
		if (!tsFile) changeName = `${changeName.slice(0, 20)}.ts`;
		changeNameTab(activeTabId, changeName);
		setEditing(tabId, false);
		toast.success("Tab name changed", { duration: 700 });
	};
	return (
		<>
			{tab.editing ? (
				<Input
					ref={inputRef}
					value={tab.name}
					onKeyDown={(e) => {
						if (e.code === "Enter") {
							e.preventDefault();
							handleTabEdited(tab.id);
						}
					}}
					className="border-none  rounded-none outline-none m-0 w-fit  max-w-32 h-full p-0   focus-visible:ring-0"
					onChange={(e) => changeNameTab(tab.id, e.target.value)}
					onBlur={() => handleTabEdited(tab.id)}
				/>
			) : (
				<span
					className={cn(
						`${tab.id === activeTabId && "underline"} line-clamp-1  `,
					)}
					spellCheck="false"
					onDoubleClick={() => {
						if (activeTabId === tab.id) {
							setEditing(tab.id, true);
							setTimeout(() => {
								inputRef.current?.focus();
							}, 100);
						}
					}}
				>
					{tab.name}
				</span>
			)}
		</>
	);
};

export function EditorTabsItem({ tab }: { tab: Tab }) {
	const inputRef = useRef<HTMLInputElement | null>(null);
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

	const handleActiveTabChange = (tabId: Tab["id"]) => {
		setActiveTab(tabId);
		updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || "");
		editorRef?.focus();
	};

	return (
		<button
			type="button"
			title={tab.name}
			className={`${
				activeTabId === tab.id && " bg-border/30 grow-2"
			}  border-r cursor-pointer transition-colors  `}
			onClick={() => {
				if (!tab.editing || activeTabId !== tab.id) {
					handleActiveTabChange(tab.id);
				}
			}}
		>
			<TabContextMenuItem
				tabs={tabs}
				tab={tab}
				removeTab={removeTab}
				setEditing={setEditing}
				inputRef={inputRef}
			>
				<div className={"group/tab flex items-center gap-x-1 px-3 py-1.5     "}>
					<EditorTabItemName
						tab={tab}
						inputRef={inputRef}
						tabs={tabs}
						changeNameTab={changeNameTab}
						activeTabId={activeTabId}
						setEditing={setEditing}
					/>
					{tabs.length > 1 && (
						<Button
							variant="destructive"
							size="icon"
							aria-label="Close tab"
							translate="no"
							className="h-5 w-5 p-0 bg-transparent rounded-full"
							onClick={(e) => {
								e.stopPropagation();
								removeTab(tab.id);
							}}
						>
							<X className="size-3" />
						</Button>
					)}
				</div>
			</TabContextMenuItem>
		</button>
	);
}
