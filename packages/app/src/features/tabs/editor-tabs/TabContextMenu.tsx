import { Copy, Download, FilePen, Files, Share, Trash } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/features/ui/context-menu";

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
					<FilePen className="size-4" />
					Rename
				</ContextMenuItem>

				<ContextMenuItem onClick={onDuplicate}>
					<Files className="size-4" />
					Duplicate
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem onClick={onCopy}>
					<Copy className="size-4" />
					Copy
				</ContextMenuItem>

				<ContextMenuItem onClick={onDownload}>
					<Download className="size-4" />
					Download
				</ContextMenuItem>

				<ContextMenuItem onClick={onShare}>
					<Share className="size-4" />
					Share
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem variant="destructive" onClick={onDelete}>
					<Trash className="size-4" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
