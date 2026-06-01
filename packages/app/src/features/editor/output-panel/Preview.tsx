import type { Tab } from "../types";

type PreviewProps = {
	tab: Tab;
};

/**
 * Stub reserved for the future Markdown slice. No language maps to the
 * `preview` panel yet, so this never renders today.
 */
export function Preview(_props: PreviewProps) {
	return null;
}

export default Preview;
