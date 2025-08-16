import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import type { ErrorBoundaryState, ErrorInfo } from "@/types/error";
import { AlertTriangle, Bug, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";
import { toast } from "sonner";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: ErrorInfo) => ReactNode;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		const errorDetails: ErrorInfo = {
			error,
			errorInfo: {
				componentStack: errorInfo.componentStack || "",
			},
			timestamp: Date.now(),
			userAgent: navigator.userAgent,
			url: window.location.href,
		};

		this.setState({
			errorInfo: errorDetails,
		});

		// Log error for debugging
		console.error("Error caught by boundary:", error, errorInfo);

		// Show toast notification
		toast.error("Something went wrong", {
			description:
				"An unexpected error occurred. Please try refreshing the page.",
			duration: 5000,
		});
	}

	handleReload = (): void => {
		window.location.reload();
	};

	handleCopyError = async (): Promise<void> => {
		if (!this.state.errorInfo) return;

		const { error, errorInfo, timestamp, userAgent, url } =
			this.state.errorInfo;

		const errorReport = `
# Error Report - RunTS

**Timestamp:** ${new Date(timestamp).toISOString()}
**URL:** ${url}
**User Agent:** ${userAgent}

## Error Details
**Message:** ${error.message}
**Stack:** 
\`\`\`
${error.stack}
\`\`\`

## Component Stack
\`\`\`
${errorInfo.componentStack}
\`\`\`
`.trim();

		try {
			await navigator.clipboard.writeText(errorReport);
			toast.success("Error details copied to clipboard", {
				description:
					"You can now paste this information when reporting the issue.",
			});
		} catch {
			toast.error("Failed to copy error details", {
				description: "Please manually copy the error information below.",
			});
		}
	};

	handleReportIssue = (): void => {
		const repoUrl = "https://github.com/acbcdev/RunTS/issues/new";
		const title = encodeURIComponent(
			`Bug: ${this.state.error?.message || "Unexpected error"}`,
		);
		const body = encodeURIComponent(
			`
**Describe the bug**
An error occurred while using RunTS.

**Error Details**
- Message: ${this.state.error?.message}
- Timestamp: ${this.state.errorInfo ? new Date(this.state.errorInfo.timestamp).toISOString() : "Unknown"}
- URL: ${this.state.errorInfo?.url || "Unknown"}

**Browser Information**
- User Agent: ${this.state.errorInfo?.userAgent || "Unknown"}

**Additional context**
Please describe what you were doing when this error occurred.
		`.trim(),
		);

		window.open(`${repoUrl}?title=${title}&body=${body}`, "_blank");
	};

	render(): ReactNode {
		if (this.state.hasError && this.state.errorInfo) {
			if (this.props.fallback) {
				return this.props.fallback(this.state.errorInfo);
			}

			return (
				<div className="min-h-screen bg-background flex items-center justify-center p-4">
					<Card className="w-full max-w-2xl bg-border">
						<CardHeader className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
								<AlertTriangle className="h-6 w-6 text-destructive" />
							</div>
							<CardTitle className="text-2xl">
								Oops! Something went wrong
							</CardTitle>
							<CardDescription>
								An unexpected error occurred in RunTS. Don't worry, your code is
								safe!
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<Bug className="h-4 w-4" />
								<AlertDescription>
									<strong>Error:</strong>{" "}
									{this.state.error?.message || "Unknown error"}
								</AlertDescription>
							</Alert>

							<div className="flex flex-col sm:flex-row gap-2">
								<Button onClick={this.handleReload}>
									<RefreshCw className="h-4 w-4 " />
									Reload Application
								</Button>
								<Button onClick={this.handleReportIssue} variant="secondary">
									<Bug className="h-4 w-4 " />
									Report Issue on GitHub
								</Button>
								{/* <Button
									onClick={this.handleCopyError}
									variant="outline"
									className="flex-1"
								>
									<Copy className="h-4 w-4 " />
									Copy Error Details
								</Button> */}
							</div>

							{/* <Collapsible>
								<CollapsibleTrigger asChild>
									<Button variant="ghost" className="w-full justify-between">
										Show Technical Details
										<ChevronDown className="h-4 w-4" />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<div className="mt-4 space-y-4">
										<div>
											<h4 className="text-sm font-semibold mb-2">
												Error Stack
											</h4>
											<pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
												{this.state.error?.stack}
											</pre>
										</div>
										<div>
											<h4 className="text-sm font-semibold mb-2">
												Component Stack
											</h4>
											<pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
												{this.state.errorInfo.errorInfo.componentStack}
											</pre>
										</div>
										<div>
											<h4 className="text-sm font-semibold mb-2">
												Environment Info
											</h4>
											<div className="text-xs space-y-1">
												<p>
													<strong>Timestamp:</strong>{" "}
													{new Date(
														this.state.errorInfo.timestamp,
													).toLocaleString()}
												</p>
												<p>
													<strong>URL:</strong> {this.state.errorInfo.url}
												</p>
												<p>
													<strong>User Agent:</strong>{" "}
													{this.state.errorInfo.userAgent}
												</p>
											</div>
										</div>
									</div>
								</CollapsibleContent>
							</Collapsible> */}
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
