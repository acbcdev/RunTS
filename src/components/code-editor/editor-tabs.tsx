import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Kd } from "@/components/ui/kd";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { useTabsStore } from "@/store/tabs";
import { Input } from "@/components/ui/input";

export function EditorTabs() {
	// useEditorStore

	const activeTabId = useTabsStore(useShallow((state) => state.activeTabId));
	const setActiveTab = useTabsStore(useShallow((state) => state.setActiveTab));
	const tabs = useTabsStore(useShallow((state) => state.tabs));
	const updateTabCode = useTabsStore(
		useShallow((state) => state.updateTabCode),
	);
	const removeTab = useTabsStore(useShallow((state) => state.removeTab));
	const changeNameTab = useTabsStore(
		useShallow((state) => state.changeNameTab),
	);
	const setEditing = useTabsStore(useShallow((state) => state.setEditing));
	const newTab = useTabsStore(useShallow((state) => state.newTab));
	const handleActiveTabChange = (tabId: string) => {
		setActiveTab(tabId);
		updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || "");
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
		alert(changeName);
		changeNameTab(activeTabId, changeName);
		setEditing(tabId, false);
		toast.success("Tab name changed", { duration: 700 });
	};

	return (
		<div className="flex items-center border-b border-border justify-start bg-background bg-opacity-80">
			<ScrollArea className="max-w-[calc(100%-32px)]">
				<div className="flex">
					{tabs.map((tab) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							key={tab.id}
							className={cn(
								`${activeTabId === tab.id ? "bg-header " : "bg-transparent hover:bg-background"}`,
								" border-border group/tab flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer transition-colors  ",
							)}
							onClick={() => handleActiveTabChange(tab.id)}
						>
							{tab.editing ? (
								<Input
									value={tab.name}
									onKeyDown={(e) => {
										if (e.code === "Enter") {
											e.preventDefault();
											handleTabEdited(tab.id);
										}
									}}
									className="border-none rounded-none outline-none m-0  max-w-32 h-fit px-0.5 underline focus-visible:ring-0"
									onChange={(e) => changeNameTab(tab.id, e.target.value)}
									onBlur={() => handleTabEdited(tab.id)}
								/>
							) : (
								<span
									className={cn(`${tab.id === activeTabId && "underline"}  `)}
									spellCheck="false"
									onDoubleClick={() => setEditing(tab.id, true)}
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
					))}
				</div>
			</ScrollArea>

			<Tooltip>
				<TooltipTrigger>
					<Button
						variant="ghost"
						aria-label="New tab"
						size="icon"
						className="rounded-full size-8 m-0 "
						onClick={newTab}
					>
						<Plus />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					New tab <Kd>(ctrl + shift + D )</Kd>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
