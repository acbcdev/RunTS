import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { TOGGLE_COMMAND } from "@/consts/shortcuts";
import { useModalStore } from "@/store/modal";
import { useHotkeys } from "react-hotkeys-hook";

export function CommandK() {
	const open = useModalStore((state) => state.commandK);
	const setOpen = useModalStore((state) => state.toggleModal);

	useHotkeys(TOGGLE_COMMAND, () => setOpen("commandK"), {
		preventDefault: true,
	});

	return (
		<CommandDialog open={open} onOpenChange={() => setOpen("commandK")}>
			<CommandInput
				placeholder="Type a command or search..."
				// onKeyDown={(e) => {
				// 	if (e.key === "") {
				// 	}
				// }}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<Calendar />
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<Smile />
						<span>Search Emoji</span>
					</CommandItem>
					<CommandItem>
						<Calculator />
						<span>Calculator</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem>
						<User />
						<span>Profile</span>
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CreditCard />
						<span>Billing</span>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings />
						<span>Settings</span>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
