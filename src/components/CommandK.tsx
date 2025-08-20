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
import {
	generateApparenceSubmenu,
	generateConfigSubmenu,
} from "@/lib/submenuGenerators";
import { useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { useModalStore } from "@/store/modal";
import type { NavigationState } from "@/types/command";
import { Check } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function CommandK() {
	const [query, setQuery] = useState("");

	const [navigationState, setNavigationState] = useState<NavigationState>({
		activeSubmenu: null,
		breadcrumbs: [],
	});

	const open = useModalStore((state) => state.commandK);
	const setOpen = useModalStore((state) => state.toggleModal);

	const config = useConfigStore((state) => state);
	const setConfigValue = useConfigStore((state) => state.setConfigValue);

	const apparence = useApparenceStore((state) => state);
	const setOption = useApparenceStore((state) => state.setOption);

	const mainCommands = useCommandItems();

	// Generate submenu commands based on the command category
	const submenuCommands = (() => {
		if (!navigationState.activeSubmenu) return [];

		// Find the parent command to determine its category
		const parentCommand = mainCommands.find(
			(cmd) => cmd.id === navigationState.activeSubmenu,
		);
		if (!parentCommand) return [];

		switch (parentCommand.category) {
			case "config":
				return generateConfigSubmenu(
					navigationState.activeSubmenu,
					config,
					setConfigValue,
				);
			case "apparence":
				return generateApparenceSubmenu(
					navigationState.activeSubmenu,
					apparence,
					setOption,
				);
			default:
				return [];
		}
	})();

	// Use main commands or submenu commands based on navigation state
	const currentCommands = navigationState.activeSubmenu
		? submenuCommands
		: mainCommands;
	const commandGroups = useCommandSearch({ commands: currentCommands, query });

	useHotkeys(TOGGLE_COMMAND, () => setOpen("commandK"), {
		preventDefault: true,
	});

	const handleSelect = (commandId: string) => {
		const command = currentCommands.find((cmd) => cmd.id === commandId);
		if (command) {
			if (command.hasSubmenu) {
				// Navigate to submenu
				setNavigationState({
					activeSubmenu: command.id,
					breadcrumbs: [
						...navigationState.breadcrumbs,
						{ id: command.id, title: command.title },
					],
				});
				setQuery(""); // Clear search when entering submenu
			} else {
				// Execute command action
				command.action();
				if (!command.preventDefault) {
					setNavigationState({ activeSubmenu: null, breadcrumbs: [] }); // Reset navigation
					setOpen("commandK"); // Close modal
					setQuery(""); // Clear search
				}
			}
		}
	};

	const handleGoBack = () => {
		setNavigationState({
			activeSubmenu: null,
			breadcrumbs: [],
		});
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Backspace" || e.key === "Delete") && query === "") {
			e.preventDefault();

			if (navigationState.activeSubmenu) {
				// Go back from submenu to main menu
				handleGoBack();
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
		setNavigationState({ activeSubmenu: null, breadcrumbs: [] });
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={handleOpenChange}
			className="min-w-[600px]"
		>
			<CommandInput
				placeholder={
					navigationState.activeSubmenu
						? "Search options..."
						: "Search commands, tabs, configuration..."
				}
				value={query}
				onValueChange={setQuery}
				onKeyDown={handleInputKeyDown}
			/>
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
										<span className={command.isSelected ? "font-medium" : ""}>
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
