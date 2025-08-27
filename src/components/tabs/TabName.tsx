import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Tab } from "@/types/editor";

interface TabNameProps {
	tab: Tab;
	isActive: boolean;
	onFinishEditing: (newName: string) => void;
	onStartEditing: () => void;
}

export const TabName = ({
	tab,
	isActive,
	onFinishEditing,
	onStartEditing,
}: TabNameProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState(tab.name);
	const editStartTimeRef = useRef<number>(0);

	// Sincronizar el estado local cuando el tab cambia o cuando empieza/termina la edición
	useEffect(() => {
		if (tab.editing) {
			setInputValue(tab.name);
			editStartTimeRef.current = Date.now(); // Marcar cuando empezó la edición
		}
	}, [tab.editing, tab.name]);

	useEffect(() => {
		if (tab.editing && isActive) {
			// Pequeño delay para asegurar que el DOM se haya actualizado
			const timer = setTimeout(() => {
				focusAndSelect();
			}, 50); // Aumentamos el delay para mayor confiabilidad

			return () => clearTimeout(timer);
		}
	}, [tab.editing, isActive]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.code === "Enter") {
			e.preventDefault();
			onFinishEditing(inputValue);
		}
		if (e.code === "Escape") {
			e.preventDefault();
			setInputValue(tab.name); // Resetear al valor original
			onFinishEditing(tab.name); // Mantener el valor original
		}
	};

	const handleBlur = () => {
		const timeSinceEditStart = Date.now() - editStartTimeRef.current;

		// Ignorar blurs que ocurren muy rápido después de empezar a editar (context menu)
		if (timeSinceEditStart < 200) {
			// Re-enfocar el input después de un pequeño delay
			setTimeout(() => {
				if (tab.editing && inputRef.current) {
					inputRef.current.focus();
					inputRef.current.select();
				}
			}, 50);
			return;
		}

		onFinishEditing(inputValue);
	};

	const handleDoubleClick = () => {
		if (isActive) {
			setInputValue(tab.name); // Asegurar que empezamos con el valor actual
			editStartTimeRef.current = Date.now(); // Marcar cuando empezó la edición
			onStartEditing();
		}
	};

	// Función para hacer focus y select en el input
	const focusAndSelect = () => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	};

	if (tab.editing) {
		return (
			<input
				ref={inputRef}
				value={inputValue}
				onKeyDown={handleKeyDown}
				onChange={(e) => setInputValue(e.target.value)}
				onBlur={handleBlur}
				className="border-none bg-transparent rounded-none outline-none m-0 w-fit max-w-32 h-full p-0 focus-visible:ring-0"
			/>
		);
	}

	return (
		<span
			className={cn("line-clamp-1 cursor-pointer", isActive && "underline")}
			spellCheck="false"
			title={tab.name}
			onDoubleClick={handleDoubleClick}
		>
			{tab.name}
		</span>
	);
};
