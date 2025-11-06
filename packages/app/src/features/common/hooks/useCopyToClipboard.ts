import { useState } from "react";

export interface UseCopyToClipboardOptions {
	timeout?: number;
}

export interface UseCopyToClipboardReturn {
	copy: (text: string) => Promise<void>;
	copied: boolean;
	error: Error | null;
}

export function useCopyToClipboard(
	options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
	const { timeout = 2000 } = options;
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setError(null);
			setTimeout(() => setCopied(false), timeout);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to copy"));
		}
	};

	return { copy, copied, error };
}
