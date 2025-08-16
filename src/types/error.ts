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
