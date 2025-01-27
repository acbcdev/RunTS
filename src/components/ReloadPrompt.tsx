import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Info, RefreshCw } from "lucide-react";

export function ReloadPrompt() {
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW() {
			toast("Service Worker Registered");
		},
		onRegisterError() {
			toast("SW registration error");
		},
		onOfflineReady() {
			toast("App ready to work offline");
		},
	});

	return (
		<>
			{needRefresh && (
				<Card className="fixed bottom-2 right-1.5 border-accent">
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
}
