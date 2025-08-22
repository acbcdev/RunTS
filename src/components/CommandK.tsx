import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { TOGGLE_COMMAND } from "@/consts/shortcuts";
import { useCommandItems } from "@/hooks/useCommandItems";
import { useCommandSearch } from "@/hooks/useCommandSearch";
import { useModalStore } from "@/store/modal";
import type { CommandOptionChild } from "@/types/command";
import { Check } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Badge } from "./ui/badge";

export function CommandK() {
	const [query, setQuery] = useState("");
	const [pages, setPages] = useState<CommandOptionChild[][]>([]);
	const [routes, setRoutes] = useState<string[]>(["Home"]);
	const open = useModalStore((state) => state.commandK);
	const setOpen = useModalStore((state) => state.toggleModal);

	const mainCommands = useCommandItems();

	// Get current page commands or main commands
	const currentCommands =
		pages.length > 0 ? pages[pages.length - 1] : mainCommands;
	const commandGroups = useCommandSearch({ commands: currentCommands, query });

	useHotkeys(TOGGLE_COMMAND, () => setOpen("commandK"), {
		preventDefault: true,
	});

	const pushPage = (commands: CommandOptionChild[], name: string) => {
		setPages((prev) => [...prev, commands]);
		setRoutes((prev) => [...prev, name]);
	};

	const popPage = () => {
		setPages((prev) => prev.slice(0, -1));
		setRoutes((prev) => prev.slice(0, -1));
	};

	const goHome = () => {
		setPages([]);
		setRoutes(["Home"]);
	};

	const handleSelect = (commandId: string) => {
		const command = currentCommands.find((cmd) => cmd.id === commandId);
		if (command) {
			if (command.children && command.children.length > 0) {
				// Navigate to children page
				pushPage(command.children, command.route || command.category);
				setQuery(""); // Clear search when entering submenu
			} else {
				// Execute command action
				command.action();
				if (!command.preventDefault) {
					goHome(); // Reset navigation
					setOpen("commandK"); // Close modal
					setQuery(""); // Clear search
					return;
				}
			}
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Backspace" || e.key === "Delete") && query === "") {
			e.preventDefault();

			if (pages.length > 0) {
				// Go back to previous page
				popPage();
			} else {
				// Close modal from main menu
				setOpen("commandK");
				setQuery("");
			}
		}
	};

	const handleOpenChange = () => {
		setOpen("commandK");
		// Reset state when closing
		setQuery("");
		goHome();
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={handleOpenChange}
			className="min-w-[600px]"
		>
			<CommandInput
				placeholder={
					pages.length > 0
						? "Search options..."
						: "Search commands, tabs, configuration..."
				}
				value={query}
				onValueChange={setQuery}
				onKeyDown={handleInputKeyDown}
			/>
			<div className="flex items-center mt-1.5 mb-2 gap-x-1 px-3">
				{routes.map((route, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Badge key={index} variant={"secondary"} className="rounded-md">
						{route}
					</Badge>
				))}
			</div>
			<CommandList className="h-[500px] ">
				<CommandEmpty>No results found.</CommandEmpty>
				{commandGroups.map((group) => (
					<div key={group.heading}>
						<CommandGroup heading={group.heading}>
							{group.items.map((command) => (
								<CommandItem
									key={command.id}
									value={command.id}
									keywords={command.keywords}
									onSelect={handleSelect}
								>
									<command.icon className="size-5" />
									<div className="flex flex-col flex-1">
										<span
											className={`${command.isSelected ? "font-medium" : ""} capitalize`}
										>
											{command.title}
										</span>
										{command.description && (
											<span className="text-xs text-muted-foreground">
												{command.description}
											</span>
										)}
									</div>
									{command.shortcut && (
										<CommandShortcut>{command.shortcut}</CommandShortcut>
									)}
									{command.isSelected && <Check />}
								</CommandItem>
							))}
						</CommandGroup>
					</div>
				))}
			</CommandList>
		</CommandDialog>
	);
}
