import { SHORTCUTS } from "@/consts/shortcuts";
import { useModalStore } from "@/store/modal";
import { useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { Kd } from "./ui/kd";
import { ScrollArea } from "./ui/scroll-area";

export function ShortCutsModal() {
	const shortcuts = useModalStore((state) => state.shortcuts);
	const toggle = useModalStore((state) => state.toggleModal);

	// Group shortcuts by category
	const groupedShortcuts = useMemo(
		() =>
			SHORTCUTS.reduce(
				(groups, shortcut) => {
					const category = shortcut.category;
					if (!groups[category]) {
						groups[category] = [];
					}
					groups[category].push(shortcut);
					return groups;
				},
				{} as Record<string, typeof SHORTCUTS>,
			),
		[],
	);

	const formatKeys = (keys: string) => {
		return keys
			.split("+")
			.map((key) => key.charAt(0).toUpperCase() + key.slice(1))
			.join(" + ");
	};

	return (
		<Dialog open={shortcuts} onOpenChange={(v) => toggle("shortcuts", v)}>
			<DialogContent className="w-[95vw] max-w-[1400px] h-[90vh] max-h-[90vh] p-8 sm:max-w-[1400px]">
				<DialogTitle className="text-2xl font-bold mb-2">
					Keyboard Shortcuts
				</DialogTitle>
				<DialogDescription className="text-base mb-6 text-muted-foreground">
					Here are all the available keyboard shortcuts you can use:
				</DialogDescription>
				<ScrollArea className="h-[calc(90vh-200px)]">
					<div className="grid grid-cols-2  gap-12 pr-4 scroll">
						{Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
							<div
								key={category}
								className={`space-y-4 ${category === "Editor" ? "col-span-2" : ""}`}
							>
								<h3 className="text-xl font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 ">
									{category}
								</h3>
								<div
									className={`space-y-3 ${category === "Editor" ? "grid grid-cols-2 gap-4" : ""}`}
								>
									{shortcuts.map((shortcut) => (
										<div
											key={shortcut.id}
											className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
										>
											<span className="text-base font-medium text-foreground flex-1 pr-4">
												{shortcut.description}
											</span>
											<div className="flex-shrink-0">
												<Kd>{formatKeys(shortcut.keys)}</Kd>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
