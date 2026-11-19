import { Check } from "lucide-react";
import { type CSSProperties, type ReactNode, useId } from "react";
import { cn } from "@/features/common/utils/utils";

interface SettingButtonGroupProps<T> {
	label: string;
	description?: string;
	options: readonly T[];
	value: T | number | string;
	onChange: (value: T) => void;
	renderLabel?: (option: T) => string;
	onValue?: (option: T) => string | number;
	renderPreview?: (option: T) => ReactNode;
	className?: string;
	buttonStyle?: (option: T) => CSSProperties;
}

export function SettingButtonGroup<T>({
	label,
	description,
	options,
	value,
	onChange,
	onValue,
	renderLabel = String,
	renderPreview,
	className,
	buttonStyle,
}: SettingButtonGroupProps<T>) {
	const id = useId();
	return (
		<fieldset className="min-w-0">
			<legend className="mb-1 text-xs font-medium">{label}</legend>
			{description && (
				<p
					id={`${id}-description`}
					className="mb-3 text-[10px] text-foreground/65"
				>
					{description}
				</p>
			)}
			<div
				className={cn(
					"grid grid-cols-3 gap-2 sm:[grid-template-columns:repeat(var(--columns),minmax(0,1fr))]",
					className,
				)}
				style={{ "--columns": options.length } as CSSProperties}
			>
				{options.map((option) => {
					const optionValue = onValue?.(option) ?? option;
					const selected = value === optionValue;
					return (
						<label
							key={String(optionValue)}
							className="relative flex min-w-0 cursor-pointer flex-col gap-3 rounded-xl border p-3 text-[11px] hover:bg-foreground/3 has-checked:bg-header has-checked:shadow-[inset_0_1px_4px_#0003] has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-foreground"
							style={buttonStyle?.(option)}
						>
							<input
								type="radio"
								className="sr-only"
								name={id}
								value={String(optionValue)}
								checked={selected}
								onChange={() => onChange(option)}
								aria-describedby={description ? `${id}-description` : undefined}
							/>
							{renderPreview && (
								<span
									aria-hidden="true"
									className={cn(
										"block",
										selected ? "text-foreground" : "text-foreground/65",
									)}
								>
									{renderPreview(option)}
								</span>
							)}
							<span className="pr-3 leading-snug">{renderLabel(option)}</span>
							<Check
								aria-hidden="true"
								className={cn(
									"absolute top-2.5 right-2.5 size-3",
									!selected && "invisible",
								)}
							/>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}
