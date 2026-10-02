import { Copy, CopyCheck, RotateCw } from "lucide-react";
import { useCopyToClipboard } from "@/features/common/hooks/useCopyToClipboard";
import { Button } from "@/features/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/features/ui/tooltip";

export function ActionButtons({
	content,
	reload,
}: {
	content: string;
	reload: () => void;
}) {
	const { copy, copied } = useCopyToClipboard();
	return (
		<div>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => copy(content)}
							size={"icon"}
							variant={"ghost"}
						>
							{copied ? <CopyCheck /> : <Copy />}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copy to clipboard</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={reload} size={"icon"} variant={"ghost"}>
							<RotateCw />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Regenerate</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
export default ActionButtons;
