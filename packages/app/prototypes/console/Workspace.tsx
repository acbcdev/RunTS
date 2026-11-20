import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import {
	ArrowDownLeft,
	Check,
	ChevronRight,
	CircleX,
	Code2,
	Pencil,
	Play,
	RotateCcw,
	Search,
	Terminal,
	Trash2,
	TriangleAlert,
	X,
} from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { VariantProps } from "./Inline";
import type { Entry } from "./model";
import { sample } from "./model";

hljs.registerLanguage("javascript", javascript);

export function Workspace({
	Variant,
	name,
	description,
}: {
	Variant: ComponentType<VariantProps>;
	name: string;
	description: string;
}) {
	const [code, setCode] = useState(sample);
	const [entries, setEntries] = useState<Entry[]>([]);
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("all");
	const [hovered, setHovered] = useState<number | null>(null);
	const [pinned, setPinned] = useState<number | null>(null);
	const [editing, setEditing] = useState(false);
	const [running, setRunning] = useState(false);
	const [duration, setDuration] = useState(0);
	const [runId, setRunId] = useState(0);
	const workerRef = useRef<Worker | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const active = hovered ?? pinned;
	const highlighted = useMemo(
		() => hljs.highlight(code, { language: "javascript" }).value.split("\n"),
		[code],
	);
	const visible = entries.filter(
		(entry) =>
			(filter === "all" ||
				(filter === "error"
					? ["error", "assert"].includes(entry.method)
					: entry.method === filter)) &&
			(!query ||
				JSON.stringify(entry.values)
					.toLowerCase()
					.includes(query.toLowerCase())),
	);
	const errors = entries.filter((entry) =>
		["error", "assert"].includes(entry.method),
	).length;
	const warnings = entries.filter((entry) => entry.method === "warn").length;
	const run = () => {
		workerRef.current?.terminate();
		if (timerRef.current) clearTimeout(timerRef.current);
		setRunning(true);
		setEditing(false);
		setHovered(null);
		setPinned(null);
		const start = performance.now();
		const worker = new Worker(new URL("./runner.ts", import.meta.url), {
			type: "module",
		});
		workerRef.current = worker;
		const finish = (result: Entry[]) => {
			setEntries(result);
			setDuration(performance.now() - start);
			setRunning(false);
			setRunId((previous) => previous + 1);
			worker.terminate();
			if (timerRef.current) clearTimeout(timerRef.current);
		};
		worker.onmessage = ({ data }: MessageEvent<Entry[]>) => finish(data);
		worker.onerror = (event) => {
			event.preventDefault();
			finish([
				{
					id: 0,
					line: 0,
					depth: 0,
					method: "error",
					values: [{ type: "error", text: event.message }],
				},
			]);
		};
		timerRef.current = setTimeout(
			() =>
				finish([
					{
						id: 0,
						line: 0,
						depth: 0,
						method: "error",
						values: [
							{ type: "error", text: "Tiempo de ejecución agotado (2 s)" },
						],
					},
				]),
			2000,
		);
		worker.postMessage(code);
	};
	// Each direction starts from the same executable example.
	useEffect(() => {
		run();
		return () => {
			workerRef.current?.terminate();
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);
	const pin = (line: number) => {
		setPinned((previous) => (previous === line ? null : line));
		editorRef.current
			?.querySelector(`[data-line="${line}"]`)
			?.scrollIntoView({ block: "nearest" });
	};
	return (
		<main className={`workspace direction-${name.toLowerCase()}`}>
			<header className="app-header">
				<div className="brand">
					<img src="/logo.svg" alt="RunTS" />
					<span>RunTS</span>
					<span className="exploration-label">CONSOLE LAB</span>
				</div>
				<div className="direction-description">
					<span>{name}</span>
					<ChevronRight size={12} />
					{description}
				</div>
				<span className="prototype-label">Prototipo interactivo</span>
			</header>
			<div className="workspace-tabs">
				<div className="file-tab">
					<span className="js-mark">JS</span>playground.js
					<span className="tab-dot" />
				</div>
				<span className="local-label">Ejecución local · JavaScript</span>
				<button
					type="button"
					className="run-button"
					onClick={run}
					disabled={running}
				>
					<Play size={12} fill="currentColor" />
					{running ? "Ejecutando…" : "Ejecutar"}
				</button>
			</div>
			<div className="workspace-panels">
				<section className="editor-panel" aria-label="Código de origen">
					<div className="panel-heading">
						<Code2 size={14} />
						<span>Editor</span>
						<button
							type="button"
							className="icon-button"
							aria-label={editing ? "Ver código" : "Editar código"}
							title={editing ? "Ver código" : "Editar código"}
							onClick={() => setEditing(!editing)}
						>
							{editing ? <Check size={14} /> : <Pencil size={13} />}
						</button>
						<button
							type="button"
							className="icon-button"
							aria-label="Restaurar ejemplo"
							title="Restaurar ejemplo"
							onClick={() => {
								setCode(sample);
								setEditing(false);
							}}
						>
							<RotateCcw size={13} />
						</button>
					</div>
					{editing ? (
						<textarea
							className="code-input"
							aria-label="Editar JavaScript"
							spellCheck={false}
							value={code}
							onChange={(event) => setCode(event.target.value)}
						/>
					) : (
						<div className="code-scroll" ref={editorRef}>
							{highlighted.map((line, i) => (
								<div
									key={`${i}-${line}`}
									data-line={i + 1}
									className={`code-line ${active === i + 1 ? "source-active" : ""}`}
								>
									<span className="line-number">{i + 1}</span>
									{/* biome-ignore lint/security/noDangerouslySetInnerHtml: highlight.js escapes the source before adding syntax spans. */}
									<code dangerouslySetInnerHTML={{ __html: line || " " }} />
									{active === i + 1 && (
										<ArrowDownLeft className="origin-arrow" size={13} />
									)}
								</div>
							))}
						</div>
					)}
					<div className="editor-footnote">
						{pinned ? (
							<>
								<span className="linked-dot" />
								Origen fijado · línea {pinned}
								<button
									type="button"
									aria-label="Desfijar origen"
									onClick={() => setPinned(null)}
								>
									<X size={12} />
								</button>
							</>
						) : (
							<>
								<ArrowDownLeft size={13} />
								Pasa sobre un resultado para ver su origen.
							</>
						)}
					</div>
				</section>
				<section className="console-panel" aria-label="Consola">
					<div className="panel-heading">
						<Terminal size={14} />
						<span>Consola</span>
						<span className="entry-count">{entries.length}</span>
						<span className="panel-spacer" />
						<span className="status-indicator" />
						<span className="runtime-label">Worker</span>
						<button
							type="button"
							className="icon-button"
							aria-label="Limpiar consola"
							title="Limpiar consola"
							onClick={() => {
								setEntries([]);
								setPinned(null);
							}}
						>
							<Trash2 size={14} />
						</button>
					</div>
					<div className="console-toolbar">
						<label className="search-field">
							<Search size={13} />
							<input
								aria-label="Filtrar mensajes"
								placeholder="Filtrar mensajes…"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
							/>
							{query && (
								<button
									type="button"
									aria-label="Borrar filtro"
									onClick={() => setQuery("")}
								>
									<X size={12} />
								</button>
							)}
						</label>
						<select
							aria-label="Nivel de mensajes"
							value={filter}
							onChange={(event) => setFilter(event.target.value)}
						>
							<option value="all">Todos los niveles</option>
							<option value="info">Info</option>
							<option value="warn">Advertencias</option>
							<option value="error">Errores</option>
							<option value="debug">Debug</option>
							<option value="table">Tablas</option>
						</select>
					</div>
					<div className="console-scroll">
						{visible.length ? (
							<Variant
								key={runId}
								entries={visible}
								onHover={setHovered}
								onPin={pin}
								pinned={active}
							/>
						) : (
							<div className="empty-console">
								<Terminal size={26} />
								<span>
									{query || filter !== "all"
										? "Sin resultados para este filtro"
										: running
											? "Ejecutando el ejemplo…"
											: "Consola vacía"}
								</span>
								<span>
									{query || filter !== "all"
										? "Prueba otro texto o nivel."
										: "Ejecuta el código para ver sus resultados."}
								</span>
							</div>
						)}
					</div>
					<div className="console-footer">
						<span className="footer-result">
							<Check size={12} />
							{running ? "Ejecutando" : "Ejecución finalizada"}
						</span>
						<span>{visible.length} eventos</span>
						<span className="footer-warning">
							<TriangleAlert size={12} />
							{warnings}
						</span>
						<span className="footer-error">
							<CircleX size={12} />
							{errors}
						</span>
						<span className="panel-spacer" />
						<span>{duration.toFixed(0)} ms</span>
					</div>
				</section>
			</div>
			<footer className="lab-footer">
				<span>
					<span className="linked-dot" />
					Hover para conectar · clic en el origen para fijar
				</span>
				<span>
					1 — 3 cambiar dirección <span className="footer-divider">/</span> R
					reiniciar
				</span>
			</footer>
		</main>
	);
}
