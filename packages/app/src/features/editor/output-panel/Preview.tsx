import { lazy } from "react";
import { useDebounce } from "@/features/common/hooks/useDebounce";
import type { Tab } from "../types";

const Markdown = lazy(() => import("@/features/ai/messages/Markdown"));

type PreviewProps = {
	tab: Tab;
};

/**
 * Live rendered output for `preview`-panel languages (markdown). Debounces the
 * tab buffer so the parse runs ~200ms after the user stops typing.
 */
export function Preview({ tab }: PreviewProps) {
	const code = useDebounce(tab.code, 200);

	return (
		<div className="h-full overflow-auto bg-background p-4">
			<Markdown variant="preview">{code}</Markdown>
		</div>
	);
}

export default Preview;
