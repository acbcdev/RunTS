import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import { themes } from "@/features/common/themes";
import { cn } from "@/features/common/utils/utils";
import { SettingButtonGroup } from "@/features/settings/components/SettingButtonGroup";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { ThemeCard } from "@/features/settings/components/ThemeCard";
import { Input } from "@/features/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
} from "@/features/ui/input-group";
import { TabsContent } from "@/features/ui/tabs";
import { SIDES, useApparenceStore } from "../appearance-store/appearance";
import { FONT_FAMILIES, LAYOUTS, RADIUS_SIZES } from "../config-consts/config";

const positions = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as const;
const positionClasses = {
	TOP: "top-1.5 left-2 right-2 h-[3px]",
	RIGHT: "right-1.5 top-2 bottom-2 w-[3px]",
	BOTTOM: "bottom-1.5 left-2 right-2 h-[3px]",
	LEFT: "left-1.5 top-2 bottom-2 w-[3px]",
};

export function Appearance() {
	const { fontSize, fontFamily, radius, theme, layout, setOption, side } =
		useApparenceStore();
	const id = useId();
	const [filter, setFilter] = useState("");
	const matchingThemes = Object.entries(themes).filter(([, value]) =>
		value.name.toLowerCase().includes(filter.toLowerCase()),
	);

	function commitFontSize(input: HTMLInputElement) {
		const size =
			input.value === "" || !Number.isFinite(input.valueAsNumber)
				? fontSize
				: Math.min(32, Math.max(10, Math.round(input.valueAsNumber / 2) * 2));
		setOption("fontSize", size);
		input.value = String(size);
	}

	return (
		<TabsContent value="appearance" className="m-0 flex flex-col gap-7">
			<SettingsSection
				title={`Color theme / ${Object.keys(themes).length}`}
				action={
					<Input
						type="search"
						aria-label="Filter themes"
						placeholder="Filter themes…"
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
						className="h-8 w-[140px]"
					/>
				}
			>
				<div className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2 lg:grid-cols-3">
					{matchingThemes.map(([key, value]) => (
						<ThemeCard
							key={key}
							theme={value}
							selected={theme === key}
							onSelect={() => setOption("theme", key)}
						/>
					))}
				</div>
				{matchingThemes.length === 0 && (
					<output className="py-4 text-xs text-foreground/65">
						No matching themes.
					</output>
				)}
			</SettingsSection>
			<SettingsSection title="Typography">
				<SettingButtonGroup
					label="Font family"
					description="Choose the typeface you want to work with."
					options={FONT_FAMILIES}
					value={fontFamily}
					onValue={(font) => font.value}
					onChange={(font) => setOption("fontFamily", font.value)}
					renderLabel={(font) => font.name}
					buttonStyle={(font) => ({ fontFamily: font.value })}
					className="grid-cols-1 sm:grid-cols-3 [&>label]:min-h-[70px] [&>label]:justify-center"
				/>
				<div className="flex items-center justify-between gap-3 py-2">
					<div>
						<label htmlFor={id} className="text-xs font-medium">
							Font size
						</label>
						<p
							id={`${id}-description`}
							className="mt-1 text-[10px] text-foreground/65"
						>
							Type a value or adjust by 2 px.
						</p>
					</div>
					<InputGroup className="w-auto shrink-0">
						<InputGroupInput
							key={fontSize}
							id={id}
							type="number"
							min={10}
							max={32}
							step={2}
							defaultValue={fontSize}
							aria-describedby={`${id}-description`}
							onBlur={(event) => commitFontSize(event.currentTarget)}
							onKeyDown={(event) => {
								if (event.key === "Enter") event.currentTarget.blur();
							}}
							className="w-10 flex-none px-0 text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						/>
						<InputGroupAddon>
							<InputGroupButton
								aria-label="Decrease font size"
								size="icon-xs"
								disabled={fontSize <= 10}
								onClick={() =>
									setOption("fontSize", Math.max(10, fontSize - 2))
								}
							>
								<Minus />
							</InputGroupButton>
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<InputGroupText>px</InputGroupText>
							<InputGroupButton
								aria-label="Increase font size"
								size="icon-xs"
								disabled={fontSize >= 32}
								onClick={() =>
									setOption("fontSize", Math.min(32, fontSize + 2))
								}
							>
								<Plus />
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</div>
			</SettingsSection>
			<SettingsSection title="Workspace">
				<SettingButtonGroup
					label="Editor layout"
					description="Arrange the editor and console."
					options={[...LAYOUTS].reverse()}
					value={layout}
					onChange={(value) => setOption("layout", value)}
					renderLabel={(value) =>
						value === "horizontal" ? "Side by side" : "Stacked"
					}
					className="grid-cols-2"
					renderPreview={(value) => (
						<span
							className={cn(
								"flex h-14 gap-1 rounded-lg bg-header p-2",
								value === "vertical" && "flex-col",
							)}
						>
							<span className="flex-1 rounded-sm border" />
							<span className="flex-[.65] rounded-sm border bg-accent/8" />
						</span>
					)}
				/>
				<SettingButtonGroup
					label="Actions position"
					description="Keep editor tools within reach."
					options={positions}
					value={side}
					onValue={(position) => SIDES[position]}
					onChange={(position) => setOption("side", SIDES[position])}
					renderLabel={(position) =>
						position[0] + position.slice(1).toLowerCase()
					}
					className="grid-cols-2 sm:grid-cols-4"
					renderPreview={(position) => (
						<span className="relative block h-11 rounded-md border bg-header">
							<span
								className={cn(
									"absolute rounded-sm bg-foreground",
									positionClasses[position],
								)}
							/>
						</span>
					)}
				/>
				<SettingButtonGroup
					label="Corner radius"
					description="How rounded cards, inputs, and menus feel."
					options={RADIUS_SIZES}
					value={radius}
					onValue={(option) => option.size}
					onChange={(option) => setOption("radius", option.size)}
					renderLabel={(option) => option.display}
					renderPreview={(option) => (
						<span className="relative block h-16 overflow-hidden rounded-xl bg-header">
							<span
								className="absolute top-3 left-3 size-11 border-t-2 border-l-2 border-foreground"
								style={{ borderTopLeftRadius: `${Number(option.size) * 42}px` }}
							/>
						</span>
					)}
				/>
			</SettingsSection>
		</TabsContent>
	);
}
