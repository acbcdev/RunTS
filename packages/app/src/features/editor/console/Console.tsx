import { Terminal } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { themes } from "@/features/common/themes";
import { useApparenceStore } from "@/features/settings/appearance-store/appearance";
import { useConfigStore } from "@/features/settings/config-store/config";
import { useEditorStore } from "../editor-store";
import type { ConsoleOutput } from "../run-code/types";
import type { Tab } from "../types";
import { alignConsoleRows } from "./alignConsoleRows";
import { InlineConsole } from "./InlineConsole";
import { InspectorConsole } from "./InspectorConsole";
import { SourceConsole } from "./SourceConsole";

const EMPTY_OUTPUT: ConsoleOutput[] = [];
const views = {
	inline: InlineConsole,
	inspector: InspectorConsole,
	"by-source": SourceConsole,
};

export function Console({ tab }: { tab: Tab }) {
	const { editorRef, alignLogs } = useEditorStore(
		useShallow((state) => ({
			editorRef: state.editorRef,
			alignLogs: state.alignLogs,
		})),
	);
	const { consoleMode, lineNumbers, wordWrap } = useConfigStore(
		useShallow((state) => ({
			consoleMode: state.consoleMode,
			lineNumbers: state.lineNumbers,
			wordWrap: state.wordWrap,
		})),
	);
	const { fontSize, fontFamily, theme } = useApparenceStore(
		useShallow((state) => ({
			fontSize: state.fontSize,
			fontFamily: state.fontFamily,
			theme: state.theme,
		})),
	);
	const [hovered, setHovered] = useState<number | null>(null);
	const [pinned, setPinned] = useState<number | null>(null);
	const container = useRef<HTMLDivElement>(null);
	const entries = tab.consoleOutput ?? EMPTY_OUTPUT;
	const active = hovered ?? pinned;
	const currentTheme = themes[theme] ?? themes.oneDark;
	const token = (name: string) =>
		currentTheme.monaco.rules.find((rule) => rule.token === name)?.foreground ??
		currentTheme.ui.foreground;
	const View = views[consoleMode] ?? InlineConsole;

	// biome-ignore lint/correctness/useExhaustiveDependencies: each run, edit, or tab change invalidates the selected source.
	useEffect(() => {
		setHovered(null);
		setPinned(null);
	}, [tab.id, tab.code, entries]);
	useEffect(() => {
		const model = editorRef?.getModel();
		if (
			!editorRef ||
			!model ||
			!active ||
			active > model.getLineCount() ||
			model.getValue() !== tab.code
		)
			return;
		const decoration = editorRef.createDecorationsCollection([
			{
				range: {
					startLineNumber: active,
					startColumn: 1,
					endLineNumber: active,
					endColumn: 1,
				},
				options: {
					isWholeLine: true,
					className: "console-source-highlight",
				},
			},
		]);
		return () => decoration.clear();
	}, [active, editorRef, tab.code]);
	useEffect(() => {
		if (
			!editorRef ||
			!container.current ||
			!alignLogs ||
			consoleMode !== "inline" ||
			!entries.length
		)
			return;
		return alignConsoleRows(editorRef, container.current);
	}, [alignLogs, editorRef, consoleMode, entries]);

	const pin = (line: number) => {
		if (!line || line > (editorRef?.getModel()?.getLineCount() ?? 0)) return;
		setPinned((previous) => (previous === line ? null : line));
		editorRef?.revealLineInCenterIfOutsideViewport(line);
	};
	return (
		<section
			aria-label="Console"
			className="flex h-full min-h-0 flex-col bg-background text-foreground"
			translate="no"
			style={
				{
					fontFamily,
					fontSize,
					lineHeight: 1.5,
					"--console-string": token("string"),
					"--console-number": token("number"),
					"--console-keyword": token("keyword"),
					"--console-property": token("type"),
					"--console-warning": currentTheme.ui.warning,
				} as CSSProperties
			}
		>
			<div
				ref={container}
				className="scroll min-h-0 flex-1 overflow-auto"
				style={{ overflowWrap: wordWrap ? "anywhere" : "normal" }}
			>
				{entries.length ? (
					<View
						key={`${tab.id}-${consoleMode}-${entries[0].timestamp}`}
						entries={entries}
						onHover={setHovered}
						onPin={pin}
						pinned={active}
						fileName={tab.name || "untitled"}
						lineNumbers={lineNumbers}
					/>
				) : tab.log ? (
					<pre className="m-0 p-4 font-[inherit] whitespace-pre-wrap">
						{tab.log}
					</pre>
				) : (
					<div className="flex h-full min-h-28 flex-col items-center justify-center gap-3 p-4 font-sans text-xs text-foreground/45">
						<Terminal className="size-6" />
						<span>Run code to see its output.</span>
					</div>
				)}
			</div>
		</section>
	);
}

Console.displayName = "Console";
export default Console;
