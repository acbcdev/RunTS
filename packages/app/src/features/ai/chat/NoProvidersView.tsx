import { Providers } from "../providers/Providers";

export function NoProvidersView() {
	return (
		<div className="flex h-full flex-col gap-4 overflow-y-auto border-r p-6">
			<div>
				<h2 className="text-lg font-semibold">Connect your AI</h2>
				<p className="text-sm text-muted-foreground">
					Add a provider and chat with your code.
				</p>
			</div>
			<Providers />
		</div>
	);
}

export default NoProvidersView;
