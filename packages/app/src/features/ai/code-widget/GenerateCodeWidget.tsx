import { Loader2, Send, X } from "lucide-react";
import type { editor } from "monaco-editor";
import { useEffect, useId, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/features/ui/input-group";

import { useAIConfigStore } from "../store/aiConfig";
import { ModelSelect } from "./model-select";
import { useGenerateCodeWidgetLogic } from "./useGenerateCodeWidgetLogic";

// Custom Model Select component for the widget

// Use Monaco's built-in types
type Editor = editor.IStandaloneCodeEditor;
type ContentWidget = editor.IContentWidget;

interface GenerateCodeWidgetContentProps {
	editor: Editor;
	onClose: () => void;
	onGenerate: (code: string) => void;
}

function GenerateCodeWidgetContent({
	editor,
	onClose,
	onGenerate,
}: GenerateCodeWidgetContentProps) {
	const [editorWidth, setEditorWidth] = useState<number>(800);
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	// Use custom hook for widget logic
	const { description, setDescription, isLoading, handleGenerate } =
		useGenerateCodeWidgetLogic(editor, onClose, onGenerate);

	// Get selected model from global store
	const selectedModel = useAIConfigStore((state) => state.selectedModel);

	// Auto-focus input when component mounts with better focus handling
	useEffect(() => {
		const focusInput = () => {
			if (inputRef.current) {
				inputRef.current.focus();
				// Ensure focus is maintained
				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.focus();
					}
				}, 100);
			}
		};

		focusInput();
	}, []);

	// Get editor dimensions and update on resize
	useEffect(() => {
		const updateWidth = () => {
			const layoutInfo = editor.getLayoutInfo();
			setEditorWidth(layoutInfo.width);
		};

		updateWidth();

		// Listen for editor layout changes
		const disposable = editor.onDidChangeModelDecorations(updateWidth);

		// Also listen for window resize
		const handleResize = () => updateWidth();
		window.addEventListener("resize", handleResize);

		return () => {
			disposable.dispose();
			window.removeEventListener("resize", handleResize);
		};
	}, [editor]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		} else if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleGenerate();
		}
	};

	return (
		<div
			style={{
				width: Math.max(editorWidth - 40, 600), // Full editor width minus padding, minimum 600px
				maxWidth: editorWidth - 40, // Responsive to editor size
			}}
		>
			<InputGroup className="dark:bg-input">
				<InputGroupInput
					ref={inputRef}
					id={inputId}
					type="text"
					placeholder="Describe what you want to generate..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					onKeyDown={handleKeyDown}
					className="text-sm focus-visible:ring-0 focus-visible:border-0"
					disabled={isLoading}
				/>

				<InputGroupAddon>
					<ModelSelect />
				</InputGroupAddon>
				<InputGroupAddon>
					<InputGroupButton
						size="icon-sm"
						variant="ghost"
						onClick={handleGenerate}
						disabled={isLoading || !description.trim() || !selectedModel.id}
						title={isLoading ? "Generating..." : "Generate code (Enter)"}
					>
						{isLoading ? (
							<Loader2 className="size-3 animate-spin" />
						) : (
							<Send className="size-3" />
						)}
					</InputGroupButton>
				</InputGroupAddon>

				<InputGroupAddon>
					<InputGroupButton
						size="icon-sm"
						variant="ghost"
						onClick={onClose}
						disabled={isLoading}
						title="Close (Esc)"
					>
						<X className="size-3" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}

// Simplified functional approach for better focus handling
export function ccreateGenerateCodeWidget(editor: Editor) {
	let isVisible = false;
	let domNode: HTMLElement | null = null;
	let root: Root | null = null;
	let contentWidget: ContentWidget | null = null;

	const show = (onGenerate: (code: string) => void) => {
		// If widget is already visible, hide it first
		if (isVisible) {
			hide();
		}

		// Create DOM node for the widget
		domNode = document.createElement("div");
		domNode.className = "generate-code-inline-widget";
		domNode.style.zIndex = "1000";

		// Render React component
		root = createRoot(domNode);
		root.render(
			<GenerateCodeWidgetContent
				editor={editor}
				onClose={hide}
				onGenerate={(code) => {
					onGenerate(code);
					hide();
				}}
			/>,
		);

		// Create Monaco content widget
		const position = editor.getPosition();
		if (!position) {
			isVisible = false;
			return;
		}

		contentWidget = {
			getId: () => "generate.code.widget",
			getDomNode: () => {
				if (!domNode) {
					throw new Error("Widget DOM node is not available");
				}
				return domNode;
			},
			getPosition: () => ({
				position: position,
				preference: [
					2, // ABOVE
					1, // BELOW
				],
			}),
			allowEditorOverflow: true, // Allow widget to overflow editor bounds
		};

		// Add widget to editor
		editor.addContentWidget(contentWidget);
		isVisible = true;
	};

	const hide = () => {
		if (contentWidget) {
			editor.removeContentWidget(contentWidget);
			contentWidget = null;
		}
		if (root) {
			root.unmount();
		}
		domNode = null;
		root = null;
		isVisible = false;
	};

	const dispose = () => {
		hide();
	};

	return { show, hide, dispose };
}
