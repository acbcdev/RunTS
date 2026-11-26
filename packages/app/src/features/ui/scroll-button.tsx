import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { useReducedMotion } from "@/features/common/hooks/useReducedMotion";
import { cn } from "../lib/cn";
import { Button, type buttonVariants } from "./button";

export type ScrollButtonProps = {
	className?: string;
	variant?: VariantProps<typeof buttonVariants>["variant"];
	size?: VariantProps<typeof buttonVariants>["size"];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollButton({
	className,
	variant = "outline",
	size = "sm",
	...props
}: ScrollButtonProps) {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();
	const reduceMotion = useReducedMotion();

	return (
		<Button
			aria-label="Scroll to bottom"
			variant={variant}
			size={size}
			disabled={isAtBottom}
			className={cn(
				"size-10 rounded-full transition-[translate,scale,opacity,color,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity",
				!isAtBottom
					? "translate-y-0 scale-100 opacity-100"
					: "pointer-events-none translate-y-4 scale-95 opacity-0",
				className,
			)}
			onClick={() =>
				scrollToBottom({ animation: reduceMotion ? "instant" : "smooth" })
			}
			{...props}
		>
			<ChevronDown className="h-5 w-5" />
		</Button>
	);
}

export { ScrollButton };
