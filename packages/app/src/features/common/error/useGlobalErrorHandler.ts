import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook to handle global async errors that don't get caught by Error Boundaries
 */
export const useGlobalErrorHandler = () => {
	useEffect(() => {
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			console.error("Unhandled promise rejection:", event.reason);

			toast.error("Async Error Occurred", {
				description: "An error occurred in an asynchronous operation.",
				duration: 5000,
			});

			// Prevent the default browser behavior
			event.preventDefault();
		};

		const handleError = (event: ErrorEvent) => {
			console.error("Global error:", event.error);

			toast.error("Unexpected Error", {
				description: "An unexpected error occurred.",
				duration: 5000,
			});
		};

		// Add global error listeners
		window.addEventListener("unhandledrejection", handleUnhandledRejection);
		window.addEventListener("error", handleError);

		// Cleanup listeners on unmount
		return () => {
			window.removeEventListener(
				"unhandledrejection",
				handleUnhandledRejection,
			);
			window.removeEventListener("error", handleError);
		};
	}, []);
};
