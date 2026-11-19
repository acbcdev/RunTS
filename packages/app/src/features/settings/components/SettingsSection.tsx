import type { ReactNode } from "react";

export function SettingsSection({
	title,
	children,
	action,
}: {
	title: string;
	children: ReactNode;
	action?: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4 border-t pt-6 first:border-0 first:pt-0">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-xs font-medium">{title}</h3>
				{action}
			</div>
			{children}
		</section>
	);
}
