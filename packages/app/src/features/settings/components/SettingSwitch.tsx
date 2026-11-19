import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/features/common/utils/utils";

export interface SettingSwitchProps {
	label: string;
	description: string;
	value: boolean;
	callback: () => void;
}

export function SettingSwitch({
	label,
	description,
	value,
	callback,
}: SettingSwitchProps) {
	const id = useId();
	return (
		<label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border px-4 py-3.5 hover:bg-foreground/3 has-checked:bg-header has-checked:shadow-[inset_0_1px_4px_#0003]">
			<span className="flex min-w-0 flex-col gap-1">
				<span className="text-xs">{label}</span>
				<span id={id} className="text-[10px] text-foreground/65">
					{description}
				</span>
			</span>
			<input
				type="checkbox"
				className="peer sr-only"
				checked={value}
				onChange={callback}
				aria-describedby={id}
			/>
			<span
				aria-hidden="true"
				className="grid size-[17px] shrink-0 place-items-center rounded-full border border-foreground/60 peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-foreground"
			>
				<Check className={cn("size-3", !value && "invisible")} />
			</span>
		</label>
	);
}
