import type { ReactNode } from "react";

export interface EmptyStateViewProps {
	icon?: ReactNode;
	title: string;
	description: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyStateView({
	icon,
	title,
	description,
	action,
	className = "text-muted-foreground",
}: EmptyStateViewProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center h-full ${className} gap-4`}
		>
			{icon}
			<p className="text-lg font-medium">{title}</p>
			<p className="text-sm text-center max-w-md">{description}</p>
			{action}
		</div>
	);
}
