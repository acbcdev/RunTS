import { Button } from "@/components/ui/button";
import { Kd } from "@/components/ui/kd";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTabsStore } from "@/store/tabs";
import { isTauri } from "@tauri-apps/api/core";
import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { EditorTabsItem } from "@/components/tabs/EditorTabsItem";
export function EditorTabs() {
	const tabs = useTabsStore(useShallow((state) => state.tabs));

	const newTab = useTabsStore(useShallow((state) => state.newTab));

	return (
		<div className="flex items-center border-b  justify-start bg-background bg-opacity-80">
			<ScrollArea className="max-w-dvw">
				<div className="flex  overflow-x-auto">
					{tabs.map((tab) => (
						<EditorTabsItem key={tab.id} tab={tab} />
					))}
				</div>
			</ScrollArea>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						aria-label="New tab"
						size="icon"
						className="rounded-full size-8 m-0 ml-1 "
						onClick={() => newTab()}
					>
						<Plus />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					New tab <Kd>{isTauri() ? "Ctrl + T" : "Ctrl + Shift + D"}</Kd>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

EditorTabs.displayName = "EditorTabs";
export default EditorTabs;
