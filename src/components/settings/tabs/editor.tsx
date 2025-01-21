import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { refreshTimes } from "@/consts";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Editor() {
	const {
		wordWrap,
		lineNumbers,
		refreshTime,
		minimap,
		whiteSpace,
		setMinimap,
		setWordWrap,
		setWhiteSpace,
		setLineNumbers,
		setRefreshTime,
	} = useConfigStore();
	const { setExperimental, experimetalConsole } = useEditorStore();

	const editorBehaviors = [
		{
			id: "wordWrap",
			callback: setWordWrap,
			value: wordWrap,
			label: "Word Wrap",
			description: "Wrap long lines of code",
		},
		{
			id: "lineNumbers",
			callback: setLineNumbers,
			value: lineNumbers,
			label: "Line Numbers",
			description: "Show line numbers in the editor",
		},
		{
			id: "minimap",
			callback: setMinimap,
			value: minimap,
			label: "Minimap",
			description: "Show minimap in the editor",
		},
		{
			id: "whiteSpace",
			callback: setWhiteSpace,
			value: whiteSpace,
			label: "White Space",
			description: "Show white space in the editor",
		},
	];
	return (
		<TabsContent value="editor" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 className="mb-4 text-base font-medium">Editor Behavior</h3>
					<div className="space-y-4">
						{editorBehaviors.map(
							({ id, callback, value, label, description }) => (
								<Label
									key={id}
									className="flex items-center justify-between p-3 rounded-lg bg-header"
								>
									<div>
										<div>{label}</div>
										<div className="text-sm">{description}</div>
									</div>
									<Switch
										checked={value}
										onCheckedChange={() => callback(!value)}
									/>
								</Label>
							),
						)}
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-base font-medium">Refresh Time</h3>
					<div className="grid grid-cols-6 gap-2 md:grid-cols-8">
						{refreshTimes.map(({ time, value }) => (
							<Button
								key={time}
								variant={refreshTime === value ? "border" : "outline"}
								onClick={() => setRefreshTime(value)}
							>
								{time}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Experimetal</h3>
					<div className="space-y-4">
						<Label className="flex items-center justify-between p-3 rounded-lg bg-header">
							<div>
								<h4>Direct Console.log</h4>
								<div className="text-xs">
									show the Console.log without need to use the
									console.log(variable) only works inline
								</div>
							</div>
							<Switch
								checked={experimetalConsole}
								onCheckedChange={() => setExperimental(!experimetalConsole)}
							/>
						</Label>
					</div>
				</section>
			</div>
		</TabsContent>
	);
}
