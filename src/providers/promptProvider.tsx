import { RefreshCw } from "lucide-react";
import { createContext, memo, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";

type PromptProviderState = {
	needRefresh: boolean;
	updateServiceWorker: (force?: boolean) => Promise<void>;
};

const initialState: PromptProviderState = {
	needRefresh: false,
	updateServiceWorker: async () => {},
};

export const PromptContext = createContext<PromptProviderState>(initialState);

interface PromptProviderProps {
	children: React.ReactNode;
}

const intervalMS = 60 * 60 * 1000;

const PromptProvider = memo(({ children }: PromptProviderProps) => {
	const {
		needRefresh: [needRefreshValue],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(registration) {
			if (registration) {
				setInterval(() => {
					registration.update();
				}, intervalMS);
			}
		},
	});

	useEffect(() => {
		if (needRefreshValue) {
			toast("New content available", {
				description: "click on reload button to update",
				icon: <RefreshCw className="size-4" />,
				action: {
					label: "Reload",
					onClick: () => updateServiceWorker(true),
				},
			});
		}
	}, [needRefreshValue, updateServiceWorker]);

	const contextValue = useMemo(
		() => ({
			needRefresh: needRefreshValue,
			updateServiceWorker,
		}),
		[needRefreshValue, updateServiceWorker],
	);

	return (
		<PromptContext.Provider value={contextValue}>
			{children}
		</PromptContext.Provider>
	);
});

PromptProvider.displayName = "PromptProvider";

export { PromptProvider };
