import { useTabsStore } from "@/store/tabs";
import type { Tab } from "@/types/editor";
import { isTauri } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { save } from "@tauri-apps/plugin-dialog";
import { encode } from "js-base64";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export function useHandler() {
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const getTab = useTabsStore(useShallow((state) => state.getTab));

	const handleShare = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();
		const url = new URL(window.location.href);
		if (tab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to share.",
				duration: 2000,
			});
			return;
		}
		try {
			const encodedCode = encode(tab?.code.trim() ?? "");
			const link = `${url.origin}/?code=${encodedCode}`;
			navigator.clipboard.writeText(link);
			toast.success("Link Created", {
				description: `The ${link.slice(
					0,
					30,
				)}... has been copied to your clipboard.`,
				duration: 2000,
			});
		} catch (e) {
			toast.error("Error creating link", {
				description: "The link could not be created.",
				duration: 2000,
			});
		}
	};

	const copyCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();
		if (tab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to copy.",
				duration: 2000,
			});
			return;
		}

		if (isTauri()) {
			writeText(tab?.code ?? "");
		} else {
			navigator.clipboard.writeText(tab?.code ?? "");
		}

		toast.success("Code copied!", {
			description: "The code has been copied to your clipboard.",
			duration: 2000,
		});
	};

	const downloadCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();

		if (!tab || tab?.code.trim() === "") {
			toast.error("Empty Code", {
				description: "The code is empty, nothing to download.",
				duration: 2000,
			});
			return;
		}

		if (isTauri()) {
			save({
				title: "Download Code",
				defaultPath: tab?.name || "code.ts",
			}).then((path) => {
				if (path) {
					toast.success("Code downloaded!", {
						description: `The code has been downloaded to '${path}'`,
						duration: 2000,
					});
				}
			});
		} else {
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
		}
	};

	return {
		handleShare,
		copyCode,
		downloadCode,
	};
}
