import { lazy } from "react";
import { useDebounce } from "@/features/common/hooks/useDebounce";
import { langFromName } from "../language/langFromName";
import type { Tab } from "../types";

const Markdown = lazy(() => import("@/features/ai/messages/Markdown"));

type PreviewProps = {
	tab: Tab;
};

/**
 * Live rendered output for `preview`-panel languages (markdown, html). Debounces
 * the tab buffer so the render runs ~200ms after the user stops typing.
 */
export function Preview({ tab }: PreviewProps) {
	const code = useDebounce(tab.code, 200);

	if (langFromName(tab.name).id === "html") {
		// allow-scripts without allow-same-origin: scripts run in an opaque origin,
		// isolated from the app (no localStorage, cookies or parent DOM access).
		return (
			<iframe
				title="HTML preview"
				sandbox="allow-scripts"
				srcDoc={code}
				className="h-full w-full border-0 bg-white"
			/>
		);
	}

	return (
		<div className="h-full overflow-auto bg-background p-4">
			<Markdown variant="preview">{code}</Markdown>
		</div>
	);
}

export default Preview;
