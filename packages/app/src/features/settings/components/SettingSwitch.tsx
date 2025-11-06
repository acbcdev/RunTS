import { Label } from "@/features/ui/label";
import { Switch } from "@/features/ui/switch";

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
	return (
		<Label className="flex border items-center justify-between p-3 md:gap-x-4 rounded-lg">
			<div className="space-y-1">
				<h3 className="font-bold">{label}</h3>
				<p className="text-sm font-medium opacity-60">{description}</p>
			</div>
			<Switch checked={value} onCheckedChange={callback} />
		</Label>
	);
}
