import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorStore } from "@/store/editor";
import { cn } from "@/lib/utils";

export function EditorTabs() {
	const {
		tabs,
		activeTabId,
		editorRef,
		addTab,
		updateTabCode,
		removeTab,
		setActiveTab,
		changeNameTab,
		currentTab,
	} = useEditorStore();

	const handleActiveTabChange = (tabId: string) => {
		setActiveTab(tabId);
		updateTabCode(tabId, tabs.find((tab) => tab.id === tabId)?.code || "");
		editorRef?.focus();
	};
	const handleAddTab = () => {
		addTab({
			name: `untitled-${Date.now().toString().slice(-4)}.ts`,
			language: "typescript",
			code: "// Start coding here\n",
			logs: [],
		});
	};

	const handleChangeName = (tabId: string) => {
		if (activeTabId !== tabId) return;

		const spanElement = document.querySelector(".underline") as HTMLSpanElement;
		if (spanElement) {
			spanElement.contentEditable = "true";
			spanElement.classList.add("outline-accent ring-0 p-2");
			const range = document.createRange();
			const selection = window.getSelection();
			if (!selection) return;
			if (!spanElement.firstChild || !spanElement.textContent) return;
			range.setStart(spanElement.firstChild, 0);
			range.setEnd(spanElement.firstChild, spanElement.textContent.length - 3);

			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
		const tabTextContent = event.currentTarget.textContent;

		if (!tabTextContent) {
			const tab = currentTab(activeTabId);
			if (!tab) return;
			event.currentTarget.textContent = tab.name;
			return;
		}

		const tsFile =
			tabTextContent.endsWith(".ts") || tabTextContent.endsWith(".js");
		const [nameTab] = tabTextContent.split(".");

		let changeName: string = tabTextContent;
		if (!tsFile) changeName = `${nameTab.slice(0, 20)}.ts`;

		changeNameTab(activeTabId, changeName);
		event.currentTarget.contentEditable = "false";
		event.currentTarget.textContent = changeName;
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	};

	return (
		<div className="flex items-center border-b border-border bg-background  bg-opacity-80">
			<ScrollArea className="max-w-[calc(100%-32px)]">
				<div className="flex">
					{tabs.map((tab) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							key={tab.id}
							className={cn(
								`${activeTabId === tab.id ? "bg-header " : "bg-transparent hover:bg-background"}`,
								" border-border group flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer transition-colors ",
							)}
							onDoubleClick={() => handleChangeName(tab.id)}
							onClick={() => handleActiveTabChange(tab.id)}
							onContextMenu={(e) => {
								e.preventDefault();
								handleChangeName(tab.id);
							}}
						>
							<span
								className={cn(`${tab.id === activeTabId && "underline"}  `)}
								onBlur={handleBlur}
								onKeyDown={handleKeyDown}
								spellCheck="false"
							>
								{tab.name}
							</span>
							{tabs.length > 1 && (
								<Button
									variant="destructive"
									size="icon"
									aria-label="Close tab"
									translate="no"
									className="w-4 h-4 p-0 opacity-0 hover:text-destructive bg-transparent group-hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation();
										removeTab(tab.id);
									}}
								>
									<X className="w-3 h-3" />
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
						className="size-5 rounded-full"
						onClick={handleAddTab}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>New tab</TooltipContent>
			</Tooltip>
		</div>
	);
}
