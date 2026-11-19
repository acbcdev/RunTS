import { Check } from "lucide-react";
import type { Theme } from "@/features/editor/types";

export function ThemeCard({
	theme,
	selected,
	onSelect,
}: {
	theme: Theme;
	selected: boolean;
	onSelect: () => void;
}) {
	function token(name: string, text: string) {
		const color = theme.monaco.rules.find(
			(rule) => rule.token === name,
		)?.foreground;
		return (
			<span
				style={{
					color: color ? `#${color.replace(/^#/, "")}` : theme.ui.foreground,
				}}
			>
				{text}
			</span>
		);
	}
	const lines = [
		<>
			{token("keyword", "const")} name {token("operator", "=")}{" "}
			{token("string", '"RunTS"')}
			{";"}
		</>,
		<>
			{token("keyword", "const")} double {token("operator", "=")} (n:{" "}
			{token("type", "number")}) {token("operator", "=>")}
		</>,
		<>
			{" "}
			n {token("operator", "*")} {token("number", "2")}
			{";"}
		</>,
		<>
			{token("function", "double")}({token("number", "21")});
		</>,
	];
	return (
		<button
			type="button"
			translate="no"
			aria-label={theme.name}
			aria-pressed={selected}
			onClick={onSelect}
			className="min-w-0 overflow-hidden rounded-[10px] border text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
			style={{
				backgroundColor: theme.ui.background,
				color: theme.ui.foreground,
				borderColor: `color-mix(in srgb, ${theme.ui.foreground} 14%, ${theme.ui.background})`,
			}}
		>
			<span
				className="flex min-h-[42px] items-center justify-between gap-2 px-3 py-2.5 text-[11px]"
				style={
					selected
						? {
								backgroundColor: `color-mix(in srgb, ${theme.ui.foreground} 7%, ${theme.ui.background})`,
								boxShadow: "inset 0 1px 4px #0003",
							}
						: undefined
				}
			>
				{theme.name}
				<span
					aria-hidden="true"
					className="grid size-4 shrink-0 place-items-center rounded-full"
					style={
						selected
							? {
									color: theme.ui.background,
									backgroundColor: theme.ui.foreground,
								}
							: undefined
					}
				>
					{selected && <Check className="size-3" />}
				</span>
			</span>
			<span
				aria-hidden="true"
				className="block border-t px-2.5 pt-3 pb-3"
				style={{
					borderColor: `color-mix(in srgb, ${theme.ui.foreground} 8%, ${theme.ui.background})`,
				}}
			>
				<code className="block font-['Cascadia_Code',monospace] text-[10px] leading-[1.9] tracking-[-.2px] sm:text-[9px]">
					{([1, 2, 3, 4] as const).map((number) => (
						<span key={number} className="flex gap-2.5 whitespace-pre">
							<span
								className="w-2 shrink-0 text-right"
								style={{ color: theme.ui.muted }}
							>
								{number}
							</span>
							<span>{lines[number - 1]}</span>
						</span>
					))}
				</code>
				<span className="mt-3 flex gap-1.5">
					{(["accent", "success", "warning", "error", "info"] as const).map(
						(key) => (
							<span
								key={key}
								className="size-[7px] rounded-full"
								style={{ backgroundColor: theme.ui[key] }}
							/>
						),
					)}
				</span>
			</span>
		</button>
	);
}
