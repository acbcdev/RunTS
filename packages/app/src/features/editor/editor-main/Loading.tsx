import type { LoaderIcon } from "lucide-react";

interface EditorLoaderProps {
	text: string;
	description: string;
	Icon: typeof LoaderIcon;
	className?: string;
}

export const Loading = ({
	text,
	description,
	Icon,
	className,
}: EditorLoaderProps) => {
	return (
		<div
			className={`flex items-center justify-center w-full h-full bg-background ${className}`}
		>
			<div className="flex flex-col items-center gap-4">
				{/* Animated logo with spinner overlay */}
				<div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
					{/* <Code2 className="size-6 text-primary" /> */}
					<Icon className="size-6 text-primary" />
				</div>
				{/* Loading text */}
				<div className="text-center animate-pulse">
					<p className="text-sm font-medium text-foreground/80">{text}</p>
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
			</div>
		</div>
	);
};

export default Loading;
