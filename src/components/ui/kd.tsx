export function Kd({ children }: { children: string }) {
	return (
		<kbd className="capitalize text-xs font-black bg-foreground/10 px-1 py-0.5  inline-flex items-center rounded-md justify-center">
			{children}
		</kbd>
	);
}
