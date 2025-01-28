import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kd } from "@/components/ui/kd";
import { useShallow } from "zustand/react/shallow";
import { useTabsStore } from "@/store/tabs";

import { EditorTabsItem } from "@/components/Tabs/EditorTabsItem";

export function EditorTabs() {
	// useEditorStore

	const tabs = useTabsStore(useShallow((state) => state.tabs));

	const newTab = useTabsStore(useShallow((state) => state.newTab));

	return (
		<div className="flex items-center border-b  justify-start bg-background bg-opacity-80">
			<ScrollArea className="max-w-[calc(100%-32px)]">
				<div className="flex">
					{tabs.map((tab) => (
						<EditorTabsItem key={tab.id} tab={tab} />
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
