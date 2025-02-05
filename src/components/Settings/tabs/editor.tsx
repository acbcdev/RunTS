import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { refreshTimes } from "@/consts";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { useShallow } from "zustand/react/shallow";

export function Editor() {
	const { setExperimental, experimetalConsole } = useEditorStore(
		useShallow((state) => ({
			setExperimental: state.setExperimental,
			experimetalConsole: state.experimetalConsole,
		})),
	);
	const {
		wordWrap,
		setWordWrap,
		lineNumbers,
		setLineNumbers,
		minimap,
		setMinimap,
		whiteSpace,
		setWhiteSpace,
		refreshTime,
		setRefreshTime,
	} = useConfigStore(
		useShallow((state) => ({
			wordWrap: state.wordWrap,
			setWordWrap: state.setWordWrap,
			lineNumbers: state.lineNumbers,
			setLineNumbers: state.setLineNumbers,
			minimap: state.minimap,
			setMinimap: state.setMinimap,
			whiteSpace: state.whiteSpace,
			setWhiteSpace: state.setWhiteSpace,
			refreshTime: state.refreshTime,
			setRefreshTime: state.setRefreshTime,
		})),
	);
	const SettingsEditor = [
		{
			label: "Word Wrap",
			callback: () => setWordWrap(!wordWrap),
			value: wordWrap,
			description: "Wrap long lines of code",
		},
		{
			label: "Line Numbers",
			callback: () => setLineNumbers(!lineNumbers),
			value: lineNumbers,
			description: "Show line numbers in the editor",
		},
		{
			label: "Minimap",
			callback: () => setMinimap(!minimap),
			value: minimap,
			description: "Show minimap in the editor",
		},
		{
			label: "White Space",
			callback: () => setWhiteSpace(!whiteSpace),
			value: whiteSpace,
			description: "Show white space in the editor",
		},
	];
	return (
		<TabsContent value="editor" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 className="mb-4 text-base font-medium">Editor Behavior</h3>
					<div className="space-y-4 md:columns-2">
						{SettingsEditor.map(({ label, description, value, callback }) => (
							<EditorSwitch
								key={label}
								label={label}
								description={description}
								value={value}
								callback={callback}
							/>
						))}
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-base font-medium">Refresh Time</h3>
					<div className="grid grid-cols-6 gap-2 md:grid-cols-8">
						{refreshTimes.map(({ time, value }) => (
							<Button
								key={time}
								variant={refreshTime === value ? "border" : "outline"}
								onClick={() => setRefreshTime(refreshTime)}
							>
								{time}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Experimetal</h3>
					<div className="space-y-4">
						<EditorSwitch
							label="Direct Console.log"
							description="show the Console.log without need to use the console.log(variable) only works inline"
							value={experimetalConsole}
							callback={() => setExperimental(!experimetalConsole)}
						/>
					</div>
				</section>
			</div>
		</TabsContent>
	);
}
type EditorSwitchProps = {
	label: string;
	description: string;
	value: boolean;
	callback: () => void;
};
function EditorSwitch({
	label,
	description,
	value,
	callback,
}: EditorSwitchProps) {
	return (
		<Label
			key={label}
			className="flex border items-center justify-between p-3 rounded-lg "
		>
			<div>
				<h3 className="font-bold ">{label}</h3>
				<p className="text-sm font-medium opacity-60">{description}</p>
			</div>
			<Switch checked={value} onCheckedChange={callback} />
		</Label>
	);
}
