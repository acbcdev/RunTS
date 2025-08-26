import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"system"}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			toastOptions={{
				style: {
					background: "var(--background)",
					color: "var(--foreground)",
					borderColor: "var(--border)",
				},
				classNames: {
					default: "bg-background text-foreground",
					success: "bg-success text-foreground",
					warning: "bg-destructive text-foreground",
					info: "bg-info text-foreground",
					loading: "bg-background text-foreground",
					content: "bg-background text-foreground p-0",
					toast: "bg-background text-foreground",
					closeButton: "bg-background hover:bg-destructice text-foreground",
					title: "bg-background text-foreground",
					error: "bg-destructive text-foreground",
					cancelButton: "bg-background text-foreground",
					description: "text-muted-foreground",
					icon: "text-accent",
					actionButton: "bg-primary text-primary-foreground",
					loader: "bg-background text-foreground",
				},
				cancelButtonStyle: {
					background: "var(--background)",
					color: "var(--foreground)",
				},
				// unstyled: true,
			}}
			{...props}
		/>
	);
};

export { Toaster };
