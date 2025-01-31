import type { Theme } from "@/types/editor";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export const updateChangeTheme = (currentTheme: Theme) => {
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	metaThemeColor?.setAttribute("content", currentTheme.ui.header);
	document.documentElement.style.setProperty(
		"--background",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--card",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--card-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--popover",
		currentTheme.ui.background,
	);
	document.documentElement.style.setProperty(
		"--popover-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--primary",
		currentTheme.ui.accent,
	);
	document.documentElement.style.setProperty(
		"--primary-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--secondary",
		currentTheme.ui.muted,
	);
	document.documentElement.style.setProperty(
		"--secondary-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty("--muted", currentTheme.ui.muted);
	document.documentElement.style.setProperty(
		"--muted-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--accent",
		currentTheme.ui.accent,
	);
	document.documentElement.style.setProperty(
		"--accent-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--destructive",
		currentTheme.ui.error,
	);
	document.documentElement.style.setProperty(
		"--destructive-foreground",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty(
		"--border",
		currentTheme.ui.border,
	);
	document.documentElement.style.setProperty("--input", currentTheme.ui.border);
	document.documentElement.style.setProperty(
		"--header",
		currentTheme.ui.header,
	);
	document.documentElement.style.setProperty(
		"--ring",
		currentTheme.ui.foreground,
	);
	document.documentElement.style.setProperty("--info", currentTheme.ui.info);
	document.documentElement.style.setProperty(
		"--success",
		currentTheme.ui.success,
	);
};
