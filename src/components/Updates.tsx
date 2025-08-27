import { useShallow } from "zustand/react/shallow";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useConfigStore } from "@/store/config";
export function Updates() {
	const { updates, setUpdates } = useConfigStore(
		useShallow((state) => ({
			updates: state.updates,
			setUpdates: state.updateConfig,
		})),
	);
	return (
		<>
			{updates && (
				<Dialog open onOpenChange={() => setUpdates({ updates: false })}>
					<DialogContent className="border-none bg-background text-info ">
						<DialogHeader>
							<DialogTitle>New Updates 🚀</DialogTitle>
							<DialogDescription className="p-4 text-lg">
								<h2 className="text-accent">🖋 Editor Improvements</h2>
								<p>
									Error Highlighting: The editor now displays errors directly in
									your code, making debugging faster and easier.
								</p>
								<p>
									Expression Recognition: Input operations like 456 + 45, and
									the editor will display the result as a variable without
									requiring console.log.
								</p>
								<p>
									Editor support for New Array and Object Methods: Array
									Methods:
								</p>
								<p>.toSorted .toReversed .toSpliced .with</p>
								<p>Object Methods:</p>
								<p>.groupBy</p>
								<h2 className="text-accent">✨ User Interface (UI)</h2>
								<p>
									UI Bug Fixes: Resolved visual bugs to improve your experience.
									<br />
									Aligned Logs: Logs are now properly aligned for easier
									readability.
								</p>
								<h2 className="text-accent">📤 Sharing Features</h2>
								<p>
									Share with a Link: Share your code with a simple link to
									collaborate seamlessly.
								</p>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
