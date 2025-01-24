import { RefreshCw } from "lucide-react";
import { createContext } from "react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";

type PromptProviderState = {
	needRefresh: boolean;
	updateServiceWorker: (force: boolean) => void;
};

const initialState: PromptProviderState = {
	needRefresh: false,
	updateServiceWorker: () => {},
};

export const PromptContext = createContext<PromptProviderState>(initialState);

interface PromptProviderProps {
	children: React.ReactNode;
}
const intervalMS = 60 * 60 * 1000;

export const PromptProvider: React.FC<PromptProviderProps> = ({ children }) => {
	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			if (r) {
				setInterval(() => {
					r.update();
				}, intervalMS);
			}
			console.log(`SW Registered: ${r}`);
		},
		onRegisterError(error) {
			console.error("SW registration error", error);
		},
	});

	const onOfflineClose = () => setOfflineReady(false);

	if (offlineReady) {
		toast("App ready to work offline", {
			onDismiss: onOfflineClose,
			onAutoClose: onOfflineClose,
		});
	}

	if (needRefresh) {
		toast("New content available", {
			description: "click on reload button to update",
			icon: <RefreshCw className="size-4" />,
			action: {
				label: "Reload",
				onClick: () => updateServiceWorker(true),
			},
		});
	}

	const value = {
		needRefresh,
		updateServiceWorker,
	};

	return (
		<PromptContext.Provider value={value}>{children}</PromptContext.Provider>
	);
};
