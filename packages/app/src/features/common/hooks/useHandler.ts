import { isTauri } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { save } from "@tauri-apps/plugin-dialog";
import { encode } from "js-base64";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import type { Tab } from "@/features/editor/types";
import { useTabsStore } from "@/features/tabs/tabs-store/tabs";
import {
	EMPTY_CODE_MESSAGES,
	CODE_ACTIONS,
	LINK_MESSAGES,
	getLinkCreatedMessage,
	getDownloadMessage,
} from "@/features/common/constants/toastMessages";

export function useHandler() {
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const getTab = useTabsStore(useShallow((state) => state.getTab));

	const handleShare = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();
		const url = new URL(window.location.href);
		if (tab?.code.trim() === "") {
			toast.error(EMPTY_CODE_MESSAGES.share);
			return;
		}
		try {
			const encodedCode = encode(tab?.code.trim() ?? "");
			const link = `${url.origin}/?code=${encodedCode}`;
			navigator.clipboard.writeText(link);
			toast.success(getLinkCreatedMessage(link.slice(0, 30)));
		} catch {
			toast.error(LINK_MESSAGES.createError);
		}
	};

	const copyCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();
		if (tab?.code.trim() === "") {
			toast.error(EMPTY_CODE_MESSAGES.copy);
			return;
		}

		if (isTauri()) {
			writeText(tab?.code ?? "");
		} else {
			navigator.clipboard.writeText(tab?.code ?? "");
		}

		toast.success(CODE_ACTIONS.copySuccess);
	};

	const downloadCode = (tabId?: Tab["id"]) => {
		const tab = tabId ? getTab(tabId) : getCurrentTab();

		if (!tab || tab?.code.trim() === "") {
			toast.error(EMPTY_CODE_MESSAGES.download);
			return;
		}

		if (isTauri()) {
			save({
				title: "Download Code",
				defaultPath: tab?.name || "code.ts",
			}).then((path) => {
				if (path) {
					toast.success(getDownloadMessage(path));
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
			toast.success(CODE_ACTIONS.downloadSuccess);
		}
	};

	return {
		handleShare,
		copyCode,
		downloadCode,
	};
}
