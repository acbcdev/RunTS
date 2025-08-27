import type {
	CommandGroup,
	CommandOption,
	CommandOptionChild,
} from "@/types/command";
import { useMemo } from "react";

interface UseCommandSearchOptions {
	commands: CommandOption[] | CommandOptionChild[];
	query: string;
	maxResults?: number;
}

export const useCommandSearch = ({
	commands,
	query,
	maxResults = 50,
}: UseCommandSearchOptions): CommandGroup[] => {
	return useMemo(() => {
		if (!query.trim()) {
			// No query, group by category
			const groups: Record<string, CommandOption[]> = {};

			for (const command of commands) {
				if (!groups[command.category]) {
					groups[command.category] = [];
				}
				groups[command.category].push(command);
			}

			return Object.entries(groups).map(([category, items]) => ({
				heading: getCategoryHeading(category),
				items: items.slice(0, 10), // Limit per category
			}));
		}

		// With query, filter and sort by relevance
		const lowerQuery = query.toLowerCase();
		const scored = commands
			.map((command) => ({
				command,
				score: calculateScore(command, lowerQuery),
			}))
			.filter(({ score }) => score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, maxResults)
			.map(({ command }) => command);

		// Group results by category
		const groups: Record<string, CommandOption[]> = {};
		for (const command of scored) {
			if (!groups[command.category]) {
				groups[command.category] = [];
			}
			groups[command.category].push(command);
		}

		return Object.entries(groups).map(([category, items]) => ({
			heading: getCategoryHeading(category),
			items,
		}));
	}, [commands, query, maxResults]);
};

function calculateScore(command: CommandOption, query: string): number {
	let score = 0;

	// Exact match in title (maximum score)
	if (command.title.toLowerCase() === query) {
		score += 100;
	}

	// Match at the beginning of title
	if (command.title.toLowerCase().startsWith(query)) {
		score += 80;
	}

	// Match in title
	if (command.title.toLowerCase().includes(query)) {
		score += 60;
	}

	// Match in description
	if (command.description?.toLowerCase().includes(query)) {
		score += 30;
	}
	if (command.forceMount) {
		score += 40;
	}

	// Match in keywords
	if (command.keywords) {
		for (const keyword of command.keywords) {
			if (keyword.toLowerCase().includes(query)) {
				score += 20;
			}
			if (keyword.toLowerCase().startsWith(query)) {
				score += 40;
			}
		}
	}

	return score;
}

function getCategoryHeading(category: string): string {
	const headings: Record<string, string> = {
		tabs: "Tabs",
		history: "History",
		config: "Configuration",
		actions: "Actions",
		navigation: "Navigation",
		apparence: "Appearance",
	};

	return headings[category] || category;
}
