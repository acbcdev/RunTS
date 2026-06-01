import { type ComponentType, lazy } from "react";
import type { OutputPanel as OutputPanelKind } from "../language/registry";
import type { Tab } from "../types";

const Console = lazy(() => import("../console/Console"));
const Preview = lazy(() => import("./Preview"));

type PanelComponent = ComponentType<{ tab: Tab }>;

// Register a panel component per kind. New panels plug in here, no control flow to touch.
const PANELS: Record<OutputPanelKind, PanelComponent | null> = {
	console: Console,
	preview: Preview,
	none: null,
};

type OutputPanelProps = {
	tab: Tab;
	panel: OutputPanelKind;
};

export function OutputPanel({ tab, panel }: OutputPanelProps) {
	const Panel = PANELS[panel];
	return Panel ? <Panel tab={tab} /> : null;
}

export default OutputPanel;
