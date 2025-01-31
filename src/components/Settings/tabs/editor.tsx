import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import {
	type EditorBehaviorOption,
	editorBehaviorsOptions,
	refreshTimes,
} from "@/consts";
import { type ConfigOptions, useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { useShallow } from "zustand/react/shallow";

export function Editor() {
	const getOption = useConfigStore(useShallow((state) => state.getOption));
	const setOption = useConfigStore(useShallow((state) => state.setOption));
	const { setExperimental, experimetalConsole } = useEditorStore(
		useShallow((state) => ({
			setExperimental: state.setExperimental,
			experimetalConsole: state.experimetalConsole,
		})),
	);

	return (
		<TabsContent value="editor" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 className="mb-4 text-base font-medium">Editor Behavior</h3>
					<div className="space-y-4">
						{(
							Object.entries(editorBehaviorsOptions) as [
								keyof ConfigOptions,
								EditorBehaviorOption,
							][]
						).map(([id, { label, description }]) => {
							const value = getOption(id);
							return (
								<Label
									key={id}
									className="flex items-center justify-between p-3 rounded-lg bg-header"
								>
									<div>
										<div>{label}</div>
										<div className="text-sm">{description}</div>
									</div>
									<Switch
										checked={Boolean(value)}
										onCheckedChange={() => setOption(id, value)}
									/>
								</Label>
							);
						})}
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-base font-medium">Refresh Time</h3>
					<div className="grid grid-cols-6 gap-2 md:grid-cols-8">
						{refreshTimes.map(({ time, value }) => (
							<Button
								key={time}
								variant={
									getOption("refreshTime") === value ? "border" : "outline"
								}
								onClick={() => setOption("refreshTime", value)}
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
