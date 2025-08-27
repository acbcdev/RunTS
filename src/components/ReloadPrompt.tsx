import { useRegisterSW } from "virtual:pwa-register/react";
import { Info, RefreshCw } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const ReloadPrompt = memo(() => {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW();

	return (
		<>
			{needRefresh && (
				<Card className="fixed z-[1000] bottom-2 min-w-2xs right-1.5 border-accent animate-in delay-700">
					<CardHeader>
						<CardTitle className="flex items-center gap-x-1.5">
							<Info className="text-accent" /> New content available
						</CardTitle>
						<CardDescription>click on reload button to update.</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center gap-x-2 justify-center">
						<Button className="w-fit" onClick={() => updateServiceWorker(true)}>
							<RefreshCw /> Reload
						</Button>
					</CardContent>
				</Card>
			)}
		</>
	);
});
