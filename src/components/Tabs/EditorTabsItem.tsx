import { useTabsStore } from "@/store/tabs";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Delete, X } from "lucide-react";
import type { Tab } from "@/types/editor";
import { useEditorStore } from "@/store/editor";
import { useHandler } from "@/hooks/useHandler";
import { useRef } from "react";

export function EditorTabsItem({ tab }: { tab: Tab }) {
	const { handleShare, copyCode, downloadCode } = useHandler();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const editorRef = useEditorStore(useShallow((state) => state.editorRef));
	const tabs = useTabsStore(useShallow((state) => state.tabs));
	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));
	const setEditing = useTabsStore(useShallow((state) => state.setEditing));
	const removeTab = useTabsStore(useShallow((state) => state.removeTab));
	const addTab = useTabsStore(useShallow((state) => state.addTab));
	const changeNameTab = useTabsStore(
		useShallow((state) => state.changeNameTab),
	);

	const updateTabCode = useTabsStore(
		useShallow((state) => state.updateTabCode),
	);

	const handleDuplicateTab = (tabId: string) => {
		const tab = tabs.find((tab) => tab.id === tabId);
		if (!tab) return;
		const id = addTab({
			name: `${tab.name}-copy`,
			language: tab.language,
			code: tab.code,
			logs: tab.logs,
		});
		handleActiveTabChange(id);
	};

	const handleActiveTabChange = (tabId: string) => {
		setActiveTab(tabId);
		updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || "");
		editorRef?.focus();
	};

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
		<ContextMenu key={tab.id}>
			<ContextMenuTrigger>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className={cn(
						`${activeTabId === tab.id ? "bg-header " : "bg-transparent hover:bg-background"}`,
						"  group/tab flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer transition-colors  ",
					)}
					onClick={() => {
						if (!tab.editing || activeTabId !== tab.id) {
							handleActiveTabChange(tab.id);
						}
					}}
				>
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
							className="border-none  rounded-none outline-none m-0  max-w-32 h-full p-0   focus-visible:ring-0"
							onChange={(e) => changeNameTab(tab.id, e.target.value)}
							onBlur={() => handleTabEdited(tab.id)}
						/>
					) : (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<span
							className={cn(`${tab.id === activeTabId && "underline"}  `)}
							spellCheck="false"
							onClick={() => {
								if (activeTabId === tab.id) setEditing(tab.id, true);
							}}
						>
							{tab.name}
						</span>
					)}
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
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						setEditing(tab.id, true);
						setTimeout(() => {
							inputRef.current?.focus();
						}, 200);
					}}
				>
					Rename
				</ContextMenuItem>
				<ContextMenuItem onClick={() => handleDuplicateTab(tab.id)}>
					Duplicate
				</ContextMenuItem>
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
				<ContextMenuItem
					className="focus:bg-destructive focus:text-destructive-foreground flex justify-between "
					onClick={() => removeTab(tab.id)}
				>
					Delete <Delete />
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
