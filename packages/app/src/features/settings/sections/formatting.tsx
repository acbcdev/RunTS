import { useShallow } from "zustand/react/shallow";
import { Button } from "@/features/ui/button";
import { Label } from "@/features/ui/label";
import { Switch } from "@/features/ui/switch";
import { TabsContent } from "@/features/ui/tabs";
import {
	AUTO_INDENT_OPTIONS,
	PRINT_WIDTHS,
	TAB_SIZES,
} from "../config-consts/config";
import { useConfigStore } from "../config-store/config";

export function Formatting() {
	const configState = useConfigStore(
		useShallow((state) => ({
			tabSize: state.tabSize,
			insertSpaces: state.insertSpaces,
			formatOnPaste: state.formatOnPaste,
			formatOnType: state.formatOnType,
			autoIndent: state.autoIndent,
			printWidth: state.printWidth,
			updateConfig: state.updateConfig,
		})),
	);

	return (
		<TabsContent value="formatting" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 className="mb-4 text-base font-medium">Indentation</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Tab Size</Label>
							<div className="grid grid-cols-8 gap-2">
								{TAB_SIZES.map((size) => (
									<Button
										key={size}
										variant={
											configState.tabSize === size ? "border" : "outline"
										}
										onClick={() => configState.updateConfig({ tabSize: size })}
									>
										{size} spaces
									</Button>
								))}
							</div>
						</div>
						<FormattingSwitch
							label="Insert Spaces"
							description="Use spaces instead of tabs for indentation"
							value={configState.insertSpaces}
							callback={() =>
								configState.updateConfig({
									insertSpaces: !configState.insertSpaces,
								})
							}
						/>
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-base font-medium">Auto-Formatting</h3>
					<div className="space-y-4">
						<FormattingSwitch
							label="Format On Paste"
							description="Automatically format code when pasting"
							value={configState.formatOnPaste}
							callback={() =>
								configState.updateConfig({
									formatOnPaste: !configState.formatOnPaste,
								})
							}
						/>
						<FormattingSwitch
							label="Format On Type"
							description="Automatically format code as you type"
							value={configState.formatOnType}
							callback={() =>
								configState.updateConfig({
									formatOnType: !configState.formatOnType,
								})
							}
						/>
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-base font-medium  ">Advanced</h3>
					<div className="space-y-4">
						<div>
							<Label className="text-sm font-medium">Auto Format</Label>
							<p className="text-sm font-medium opacity-60">
								Controls how aggressive auto-formatting is
							</p>
						</div>
						<div className="grid grid-cols-8 gap-2">
							{AUTO_INDENT_OPTIONS.map((option) => (
								<Button
									key={option.value}
									value={option.value}
									onClick={() => {
										configState.updateConfig({ autoIndent: option.value });
									}}
									variant={
										option.value === configState.autoIndent
											? "border"
											: "outline"
									}
								>
									{option.label}
								</Button>
							))}
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium">Print Width</Label>
							<p className="text-sm font-medium opacity-60">
								Maximum line length for code formatting (Prettier)
							</p>
							<div className="grid grid-cols-8 gap-2">
								{PRINT_WIDTHS.map((width) => (
									<Button
										key={width}
										variant={
											configState.printWidth === width ? "border" : "outline"
										}
										onClick={() =>
											configState.updateConfig({ printWidth: width })
										}
									>
										{width}
									</Button>
								))}
							</div>
						</div>
					</div>
				</section>
			</div>
		</TabsContent>
	);
}

type FormattingSwitchProps = {
	label: string;
	description: string;
	value: boolean;
	callback: () => void;
};

function FormattingSwitch({
	label,
	description,
	value,
	callback,
}: FormattingSwitchProps) {
	return (
		<Label className="flex border items-center justify-between p-3 md:gap-x-4 rounded-lg ">
			<div className="space-y-1">
				<h3 className="font-bold  ">{label}</h3>
				<p className="text-sm font-medium opacity-60">{description}</p>
			</div>
			<Switch checked={value} onCheckedChange={callback} />
		</Label>
	);
}
