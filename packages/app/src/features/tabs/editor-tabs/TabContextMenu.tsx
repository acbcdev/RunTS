import {
	Copy,
	Download,
	FilePen,
	Files,
	Languages,
	Share,
	Trash,
} from "lucide-react";
import { type LanguageId, REGISTRY } from "@/features/editor/language/registry";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/features/ui/context-menu";

interface TabContextMenuProps {
	children: React.ReactNode;
	currentLanguage: LanguageId;
	onRename: () => void;
	onDuplicate: () => void;
	onConvert: (langId: LanguageId) => void;
	onCopy: () => void;
	onDownload: () => void;
	onShare: () => void;
	onDelete: () => void;
}

export const TabContextMenu = ({
	children,
	currentLanguage,
	onRename,
	onDuplicate,
	onConvert,
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

				<ContextMenuSub>
					<ContextMenuSubTrigger>
						<Languages className="size-4" />
						Convert to
					</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						{Object.values(REGISTRY).map((lang) => (
							<ContextMenuCheckboxItem
								key={lang.id}
								checked={lang.id === currentLanguage}
								disabled={lang.id === currentLanguage}
								onClick={() => onConvert(lang.id)}
							>
								{lang.label}
							</ContextMenuCheckboxItem>
						))}
					</ContextMenuSubContent>
				</ContextMenuSub>

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
