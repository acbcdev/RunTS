import type { ReactNode } from "react";

export interface ErrorInfo {
	error: Error;
	errorInfo: {
		componentStack: string;
	};
	timestamp: number;
	userAgent: string;
	url: string;
}

export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: ErrorInfo) => ReactNode;
}
