import { cn } from "@/lib/utils";
import { Loader } from "./ui/loader";

interface LoaderProps {
	text?: string;
	subtitle?: string;
	className?: string;
}

export const LoadingMain = ({
	subtitle = "Preparing your coding environment",
	className,
}: LoaderProps) => {
	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex flex-col items-center gap-6">
				{/* Logo with animated border */}
				<div className="relative">
					<div className="w-20 h-20 flex items-center justify-center">
						<img src="/logo.png" alt="RunTS Logo" className="w-12 h-12" />
					</div>
					{/* Spinning border */}
				</div>
				{/* Content */}
				<div className="text-center space-y-2">
					<h2 className="text-xl font-semibold text-foreground">RunTS</h2>
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				</div>

				{/* Loading animation */}
				<Loader />
			</div>
		</div>
	);
};

export default LoadingMain;
