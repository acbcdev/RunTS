import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Download, FilePen, Files, Share, Trash } from "lucide-react";

interface TabContextMenuProps {
	children: React.ReactNode;
	onRename: () => void;
	onDuplicate: () => void;
	onCopy: () => void;
	onDownload: () => void;
	onShare: () => void;
	onDelete: () => void;
}

export const TabContextMenu = ({
	children,
	onRename,
	onDuplicate,
	onCopy,
	onDownload,
	onShare,
	onDelete,
}: TabContextMenuProps) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onMouseDown={(e) => {
						e.preventDefault();
						onRename();
					}}
				>
					<FilePen className="mr-2 h-4 w-4" />
					Rename
				</ContextMenuItem>

				<ContextMenuItem onClick={onDuplicate}>
					<Files className="mr-2 h-4 w-4" />
					Duplicate
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem onClick={onCopy}>
					<Copy className="mr-2 h-4 w-4" />
					Copy
				</ContextMenuItem>

				<ContextMenuItem onClick={onDownload}>
					<Download className="mr-2 h-4 w-4" />
					Download
				</ContextMenuItem>

				<ContextMenuItem onClick={onShare}>
					<Share className="mr-2 h-4 w-4" />
					Share
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem
					className="text-destructive focus:text-destructive"
					onClick={onDelete}
				>
					<Trash className="mr-2 h-4 w-4" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
