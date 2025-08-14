import { useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { useTabsStore } from "@/store/tabs";
import { Suspense, lazy } from "react";
import { useShallow } from "zustand/react/shallow";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export function Console() {
	// useTabsStore
	const lineNumbers = useConfigStore(useShallow((state) => state.lineNumbers));
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
	// const { toggleChat } = useAIConfigStore(
	// 	useShallow((state) => ({
	// 		toggleChat: state.toggleChat,
	// 	})),
	// );

	// const handleAskAI = () => {
	// 	toggleChat(true);
	// };
	return (
		<div className="relative h-full bg-background group/console" translate="no">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full bg-background animate-pulse">
						<div className="text-lg animate-pulse text-muted">
							Loading Terminal...
						</div>
					</div>
				}
			>
				{/* <Tooltip delayDuration={50}>
					<TooltipTrigger className="absolute hidden duration-200 group-hover/console:block z-50 top-1 right-4">
						<Button
							variant="ghost"
							size="icon"
							aria-label="ask AI about output"
							onClick={handleAskAI}
							className={
								"size-8   from-accent hover:bg-linear-to-br hover:text-foreground from-30% to-destructive"
							}
						>
							<Sparkles className="rotate-90" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">Explain Output</TooltipContent>
				</Tooltip> */}

				<MonacoEditor
					value={getCurrentTab()?.logsFormated ?? ""}
					language="javascript"
					theme={theme}
					options={{
						lineNumbers: lineNumbers ? "on" : "off",
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
						cursorBlinking: "phase",
						codeLens: false,
						multiCursorLimit: 0,
						lineDecorationsWidth: 0,
						lineNumbersMinChars: 2,
						renderWhitespace: "selection",

						renderLineHighlight: "none",
						selectionHighlight: false,
					}}
				/>
			</Suspense>
		</div>
	);
}

Console.displayName = "Console";
export default Console;
