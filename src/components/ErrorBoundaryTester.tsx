import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/**
 * Component for testing error boundary functionality
 * This should be removed in production
 */
export const ErrorBoundaryTester = () => {
	const [shouldThrow, setShouldThrow] = useState(false);

	const throwSyncError = () => {
		setShouldThrow(true);
	};

	const throwAsyncError = async () => {
		// This will be caught by the global error handler
		await new Promise((_, reject) => {
			setTimeout(() => reject(new Error("Test async error")), 100);
		});
	};

	const throwPromiseRejection = () => {
		// This will be caught by the unhandled rejection listener
		Promise.reject(new Error("Test promise rejection"));
	};

	if (shouldThrow) {
		throw new Error("Test error for Error Boundary");
	}

	// Only show in development
	if (process.env.NODE_ENV === "production") {
		return null;
	}

	return (
		<Card className="m-4 border-destructive/20 fixed inset-0 z-50 w-2xl mx-auto h-48 ">
			<CardHeader>
				<CardTitle className="text-destructive">
					🚨 Error Boundary Tester
				</CardTitle>
				<CardDescription>
					Test the error boundary functionality (development only)
				</CardDescription>
			</CardHeader>
			<CardContent className="flex gap-2">
				<Button onClick={throwSyncError} variant="destructive" size="sm">
					Throw Sync Error
				</Button>
				<Button onClick={throwAsyncError} variant="outline" size="sm">
					Throw Async Error
				</Button>
				<Button onClick={throwPromiseRejection} variant="outline" size="sm">
					Throw Promise Rejection
				</Button>
			</CardContent>
		</Card>
	);
};
