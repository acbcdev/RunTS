import { lazy } from "react";
import { useShallow } from "zustand/react/shallow";
import { useApparenceStore } from "@/features/settings/appearance-store/appearance";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/features/ui/resizable";
import type { LanguageDef } from "../language/registry";
import type { Tab } from "../types";

const EditorMain = lazy(() => import("../editor-main/EditorMain"));
const OutputPanel = lazy(() => import("../output-panel/OutputPanel"));

type EditorLayoutProps = {
	tab: Tab;
	lang: LanguageDef;
};

export function EditorLayout({ tab, lang }: EditorLayoutProps) {
	const layout = useApparenceStore(useShallow((state) => state.layout));

	// No output panel -> editor takes the full width, no split/handle.
	if (lang.panel === "none") {
		return <EditorMain tab={tab} language={lang.monaco} />;
	}

	return (
		<ResizablePanelGroup direction={layout}>
			<ResizablePanel defaultSize={60}>
				<EditorMain tab={tab} language={lang.monaco} />
			</ResizablePanel>
			<ResizableHandle withHandle className="w-1" />
			<ResizablePanel defaultSize={40}>
				<OutputPanel tab={tab} panel={lang.panel} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default EditorLayout;
