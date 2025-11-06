import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { getModifierKey } from "@/features/common/utils/shortcuts";
import { Button } from "@/features/ui/button";
import { Kbd, KbdGroup } from "@/features/ui/kbd";
import { ScrollArea } from "@/features/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/ui/tooltip";
import { useTabsStore } from "../tabs-store/tabs";
import { EditorTabsItem } from "./EditorTabsItem";
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
					<KbdGroup>
						New tab <Kbd>{getModifierKey()}</Kbd> + <Kbd>Alt</Kbd> +{" "}
						<Kbd>T</Kbd>
					</KbdGroup>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

EditorTabs.displayName = "EditorTabs";
export default EditorTabs;
