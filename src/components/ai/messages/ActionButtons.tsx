import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ActionButtons({
	content,
}: {
	content: string;
	reload: () => void;
}) {
	const [copied, setCopied] = useState(false);
	const copyToClipboard = () => {
		navigator.clipboard.writeText(content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<div>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={copyToClipboard} size={"icon"} variant={"ghost"}>
							{copied ? <CopyCheck /> : <Copy />}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copy to clipboard</TooltipContent>
				</Tooltip>

				{/* <Tooltip>
					<TooltipTrigger>
						<Button onClick={reload} size={"icon"} variant={"ghost"}>
							<RotateCw />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Reload</TooltipContent>
				</Tooltip> */}
			</TooltipProvider>
		</div>
	);
}
