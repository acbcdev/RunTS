import { useTabsStore } from "@/store/tabs";
import type { Tab } from "@/types/editor";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export function useHandler() {
	const activeTab = useTabsStore(useShallow((state) => state.getCurrentTab()));
	const getTab = useTabsStore(useShallow((state) => state.getTab));

	const clearConsole = useTabsStore(useShallow((state) => state.clearConsole));
	const handleShare = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : activeTab;
		const url = new URL(window.location.href);
		if (tab?.code === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to share.",
				duration: 2000,
			});
			return;
		}
		const link = `${url.origin}/?code=${btoa(tab?.code ?? "")}`;
		navigator.clipboard.writeText(link);
		toast.success("Link Created", {
			description: `The ${link} has been copied to your clipboard.`,
			duration: 2000,
		});
	};
	const handleClear = () => {
		clearConsole();
		toast.success("Console cleared", {
			description: "The console output has been cleared.",
			duration: 2000,
		});
	};

	const copyCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : activeTab;
		if (tab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to copy.",
				duration: 2000,
			});
			return;
		}
		navigator.clipboard.writeText(tab?.code ?? "");
		toast.success("Code copied!", {
			description: "The code has been copied to your clipboard.",
			duration: 2000,
		});
	};

	const downloadCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : activeTab;

		if (!tab || tab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to download.",
				duration: 2000,
			});
			return;
		}
		const blob = new Blob([tab?.code ?? ""], {
			type: "text/typescript",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = tab?.name || "code.ts";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Code downloaded!", {
			description: "The code has been downloaded as 'code.js'",
			duration: 2000,
		});
	};
	return {
		handleShare,
		handleClear,
		copyCode,
		downloadCode,
	};
}
