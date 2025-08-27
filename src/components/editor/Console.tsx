import { CONSOLE_EDITOR_CONFIG } from "@/consts/editor";
import { useApparenceStore } from "@/store/apparence";
import { useConfigStore } from "@/store/config";
import { Tab } from "@/types/editor";
import { lazy } from "react";
import { useShallow } from "zustand/react/shallow";
import { Loading } from "./Loading";
import { Terminal } from "lucide-react";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

type ConsoleProps = {
	tab: Tab;
};
export function Console({ tab }: ConsoleProps) {
	// useTabsStore
	const lineNumbers = useConfigStore(useShallow((state) => state.lineNumbers));

	const { fontSize, fontFamily, theme } = useApparenceStore(
		useShallow((state) => ({
			fontSize: state.fontSize,
			theme: state.theme,
			fontFamily: state.fontFamily,
		})),
	);
	// const { toggleChat } = useAIConfigStore(
	// 	useShallow((state) => ({
	// 		toggleChat: state.toggleChat,
	// 	})),
	// );

	// const handleAskAI = () => {
	// 	toggleChat(true);
	// };
	return (
		<div className="relative h-full bg-background group/console" translate="no">
			<MonacoEditor
				value={tab.log}
				language="javascript"
				theme={theme}
				loading={
					<Loading
						Icon={Terminal}
						text="Loading Console..."
						description="Please wait while we load the console."
					/>
				}
				options={{
					lineNumbers: lineNumbers ? "on" : "off",
					fontSize,
					fontFamily,
					...CONSOLE_EDITOR_CONFIG,
				}}
			/>
		</div>
	);
}

Console.displayName = "Console";
export default Console;
