import type { LucideIcon } from "lucide-react";

export type CommandOptionChild = CommandOption & {
	parentId: string;
};

export interface CommandOption {
	id: string;
	title: string;
	description?: string;
	icon: LucideIcon;
	shortcut?: string;
	category: CommandCategory;
	action: () => void;
	keywords?: string[]; // Para mejorar la búsqueda
	preventDefault?: boolean;
	route?: string;
	children?: string; // Submenús directos
	isSelected?: boolean; // Para marcar el valor actual en submenús
	forceMount?: boolean;
}

export interface NavigationState {
	activeSubmenu: string | null;
	breadcrumbs: { id: string; title: string }[];
}

export type CommandCategory =
	| "tabs"
	| "history"
	| "config"
	| "actions"
	| "navigation"
	| string;

export interface CommandGroup {
	heading: string;
	items: CommandOption[] | CommandOptionChild[];
	forceMount?: boolean;
}
