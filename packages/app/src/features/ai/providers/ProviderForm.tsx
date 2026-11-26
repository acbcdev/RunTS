import { Copy, ExternalLink } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/features/common/utils/utils";
import { Button } from "@/features/ui/button";
import {
	COMPATIBLE_PRESETS,
	listModels,
	PRESETS,
	type PresetId,
	type ProviderConfig,
} from "../lib/constants";

type Status =
	| { state: "idle" }
	| { state: "testing" }
	| { state: "ok"; count: number }
	| { state: "error"; message: string; cors: boolean };

export function newProvider(preset: PresetId): ProviderConfig {
	const p = PRESETS[preset];
	return {
		id: crypto.randomUUID(),
		kind: p.kind,
		preset,
		name: p.name,
		baseURL: p.baseURL,
		apiKey: "",
		models: [...(p.models ?? [])],
	};
}

export function ProviderForm({
	initial,
	onSave,
	onCancel,
}: {
	initial: ProviderConfig;
	onSave: (provider: ProviderConfig) => void;
	onCancel: () => void;
}) {
	const id = useId();
	const [draft, setDraft] = useState(initial);
	const [available, setAvailable] = useState<string[]>([]);
	const [status, setStatus] = useState<Status>({ state: "idle" });
	const [search, setSearch] = useState("");
	const preset = PRESETS[draft.preset];
	// Chips only for the generic compatible flow; Anthropic/OpenRouter are fixed.
	const showChips =
		draft.preset === "custom" || COMPATIBLE_PRESETS.includes(draft.preset);
	const keyRequired = !preset.local && draft.preset !== "custom";
	const canTest = !!draft.baseURL && (!keyRequired || !!draft.apiKey);
	const canSave = canTest && !!draft.name.trim() && draft.models.length > 0;

	const all = [...new Set([...draft.models, ...available])];
	const query = search.trim().toLowerCase();
	const shown = query
		? all.filter((m) => m.toLowerCase().includes(query))
		: all;

	const patch = (changes: Partial<ProviderConfig>) =>
		setDraft((d) => ({ ...d, ...changes }));

	const pickPreset = (next: PresetId) => {
		const p = PRESETS[next];
		// Keep a name the user typed; replace the previous preset's default.
		const name = draft.name === preset.name ? p.name : draft.name;
		patch({
			preset: next,
			name,
			baseURL: p.baseURL,
			models: [...(p.models ?? [])],
		});
		setAvailable([]);
		setStatus({ state: "idle" });
	};

	const toggle = (model: string) =>
		patch({
			models: draft.models.includes(model)
				? draft.models.filter((m) => m !== model)
				: [...draft.models, model],
		});

	const test = async () => {
		setStatus({ state: "testing" });
		try {
			const models = await listModels(draft);
			setAvailable(models);
			// ponytail: auto-show small lists (local servers); big catalogs (OpenRouter) stay opt-in.
			if (draft.models.length === 0 && models.length <= 10) patch({ models });
			setStatus({ state: "ok", count: models.length });
		} catch (error) {
			// fetch() rejects with TypeError when CORS or the network blocks it.
			const cors = error instanceof TypeError;
			setStatus({
				state: "error",
				cors,
				message: cors ? "Can't reach server" : String((error as Error).message),
			});
		}
	};

	const addTyped = () => {
		const model = search.trim();
		if (!model) return;
		if (!draft.models.includes(model))
			patch({ models: [...draft.models, model] });
		setSearch("");
	};

	const origin = window.location.origin;
	const ollamaCmd = `OLLAMA_ORIGINS=${origin} ollama serve`;
	const showCors = preset.local || (status.state === "error" && status.cors);

	const row = "flex items-center gap-4 border-b py-2.5";
	const label = "w-20 shrink-0 text-xs text-muted-foreground";
	const input =
		"min-w-0 flex-1 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground/60";

	return (
		<form
			className="flex flex-col gap-5"
			onSubmit={(event) => {
				event.preventDefault();
				if (canSave) onSave({ ...draft, name: draft.name.trim() });
			}}
		>
			{showChips && (
				<fieldset aria-label="Preset" className="flex flex-wrap gap-2">
					{COMPATIBLE_PRESETS.map((key) => {
						const { icon: Icon, name } = PRESETS[key];
						return (
							<button
								key={key}
								type="button"
								aria-pressed={draft.preset === key}
								onClick={() =>
									pickPreset(draft.preset === key ? "custom" : key)
								}
								className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs hover:bg-foreground/3 aria-pressed:bg-header aria-pressed:shadow-[inset_0_1px_4px_#0003] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
							>
								<Icon className="size-3.5" />
								{name}
							</button>
						);
					})}
				</fieldset>
			)}

			<div className="flex flex-col border-t">
				<label className={row} htmlFor={`${id}-name`}>
					<span className={label}>Name</span>
					<input
						id={`${id}-name`}
						className={input}
						value={draft.name}
						onChange={(e) => patch({ name: e.target.value })}
					/>
				</label>
				{draft.kind === "openai-compatible" &&
					draft.preset !== "openrouter" && (
						<label className={row} htmlFor={`${id}-url`}>
							<span className={label}>Base URL</span>
							<input
								id={`${id}-url`}
								className={cn(input, "font-mono text-xs")}
								placeholder="https://.../v1"
								spellCheck={false}
								value={draft.baseURL}
								onChange={(e) => patch({ baseURL: e.target.value.trim() })}
							/>
						</label>
					)}
				<div className={row}>
					<label className={label} htmlFor={`${id}-key`}>
						API key
					</label>
					<input
						id={`${id}-key`}
						type="password"
						autoComplete="off"
						spellCheck={false}
						className={cn(input, "font-mono text-xs")}
						placeholder={
							keyRequired ? (preset.keyPlaceholder ?? "required") : "optional"
						}
						value={draft.apiKey}
						onChange={(e) => patch({ apiKey: e.target.value.trim() })}
					/>
					{preset.keyUrl && (
						<Button
							asChild
							size="sm"
							variant="ghost"
							className="h-7 rounded-full px-3 text-xs text-muted-foreground"
						>
							<a href={preset.keyUrl} target="_blank" rel="noreferrer">
								Get key <ExternalLink className="size-3" />
							</a>
						</Button>
					)}
				</div>
				<div className={row}>
					<output
						className={cn(
							"flex-1 text-xs text-muted-foreground",
							status.state === "ok" && "text-green-500",
							status.state === "error" && "text-destructive",
						)}
					>
						{status.state === "idle" && "Not tested"}
						{status.state === "testing" && "Testing..."}
						{status.state === "ok" && `Connected · ${status.count} models`}
						{status.state === "error" && status.message}
					</output>
					<Button
						type="button"
						size="sm"
						variant="secondary"
						className="rounded-full"
						disabled={!canTest || status.state === "testing"}
						onClick={test}
					>
						Test connection
					</Button>
				</div>
			</div>

			{showCors && (
				<div className="flex flex-col gap-2 rounded-xl border bg-foreground/3 p-4 text-xs">
					<p className="font-medium text-sm">Allow access from this app</p>
					<p className="text-muted-foreground">
						The browser blocks calls to your local server until it accepts{" "}
						<code className="font-mono text-foreground">{origin}</code>.
					</p>
					{draft.preset === "ollama" && (
						<>
							<p className="text-muted-foreground">
								Quit Ollama and start it with your origin allowed:
							</p>
							<div className="flex items-center gap-2 rounded-lg bg-background/60 px-3 py-2 font-mono">
								<code className="flex-1 truncate">{ollamaCmd}</code>
								<Button
									type="button"
									size="sm"
									variant="ghost"
									onClick={() => {
										navigator.clipboard.writeText(ollamaCmd);
										toast.success("Copied");
									}}
								>
									<Copy /> Copy
								</Button>
							</div>
						</>
					)}
					{draft.preset === "lmstudio" && (
						<p className="text-muted-foreground">
							Developer → Server Settings → enable "Enable CORS" and restart the
							server.
						</p>
					)}
					{!preset.local && (
						<p className="text-muted-foreground">
							Check the URL and that the server allows CORS from this origin.
						</p>
					)}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<h4 className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
					Visible models ({draft.models.length}/{all.length})
				</h4>
				<input
					aria-label="Search or add a model id"
					className="rounded-full border bg-transparent px-4 py-2 text-sm outline-hidden placeholder:text-muted-foreground/60 focus:border-foreground/40"
					placeholder={
						all.length
							? `Search ${all.length} or add one...`
							: "Add a model id by hand..."
					}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key !== "Enter") return;
						e.preventDefault();
						addTyped();
					}}
				/>
				{all.length === 0 ? (
					<p className="px-4 py-2 text-xs text-muted-foreground">
						Test the connection to fetch models, or type an id and press Enter.
					</p>
				) : (
					<>
						<label className="flex items-center gap-3 px-4 py-1 text-xs text-muted-foreground">
							<input
								type="checkbox"
								className="accent-foreground"
								checked={draft.models.length === all.length}
								onChange={(e) => patch({ models: e.target.checked ? all : [] })}
							/>
							{all.length} models · {draft.models.length} visible
						</label>
						<ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
							{shown.map((model) => (
								<li key={model}>
									<label className="flex items-center gap-3 rounded-full px-4 py-2 font-mono text-xs hover:bg-foreground/3 has-checked:bg-header">
										<input
											type="checkbox"
											className="accent-foreground"
											checked={draft.models.includes(model)}
											onChange={() => toggle(model)}
										/>
										<span className="truncate">{model}</span>
									</label>
								</li>
							))}
						</ul>
					</>
				)}
			</div>

			<div className="flex gap-2">
				<Button type="submit" className="rounded-full" disabled={!canSave}>
					Save
				</Button>
				<Button
					type="button"
					variant="ghost"
					className="rounded-full"
					onClick={onCancel}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
