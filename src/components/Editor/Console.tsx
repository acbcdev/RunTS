import { ajuestLogs } from "@/lib/ajuestLogs";
import { useApparenceStore } from "@/store/apparence";
import { useTabsStore } from "@/store/tabs";
import { lazy, Suspense } from "react";
import { useShallow } from "zustand/react/shallow";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export function Console() {
	// useTabsStore
	const getCurrentTab = useTabsStore(
		useShallow((state) => state.getCurrentTab),
	);
	const { fontSize, fontFamily, theme } = useApparenceStore(
		useShallow((state) => ({
			fontSize: state.fontSize,
			theme: state.theme,
			fontFamily: state.fontFamily,
		})),
	);
	return (
		<div className="relative h-full bg-background" translate="no">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full bg-background animate-pulse">
						<div className="text-lg animate-pulse text-muted">
							Loading Terminal...
						</div>
					</div>
				}
			>
				<MonacoEditor
					value={ajuestLogs(getCurrentTab()?.logs ?? []) ?? ""}
					language="javascript"
					theme={theme}
					options={{
						lineNumbers: "on",
						language: "javascript",
						scrollbar: {
							horizontal: "visible",
							vertical: "auto",
						},
						minimap: { enabled: false },
						readOnly: true,
						wordWrap: "on",
						padding: {
							top: 20,
							bottom: 12,
						},
						fontSize,
						automaticLayout: true,
						fontFamily,
						fontLigatures: true,
						glyphMargin: false,
						scrollBeyondLastLine: false,
						folding: true,
						bracketPairColorization: {
							enabled: false,
						},
						cursorStyle: "block",
						cursorBlinking: "expand",
						codeLens: false,
						multiCursorLimit: 0,
						lineDecorationsWidth: 0,
						lineNumbersMinChars: 0,
						renderWhitespace: "selection",

						renderLineHighlight: "none",
						selectionHighlight: false,
					}}
				/>
			</Suspense>
		</div>
	);
}
