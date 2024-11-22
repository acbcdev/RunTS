export function injectLogsIntoCode(code: string): string {
	const unwantedRegex =
		/^\s*(const|let|var|function|return|if|else|for|while|try|catch|switch|continue|debugger|console\.|async)\b|^\s*[{}()\]]$|^\s*$/;
	const rta: string[] = [];
	const lines = code.split("\n");
	let contextDepth = 0; // Controla el nivel de profundidad en bloques de código ({})

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Ajustar el contexto al detectar apertura/cierre de llaves
		if (trimmedLine.includes("{")) contextDepth++;

		if (trimmedLine.includes("}")) contextDepth--;

		// Manejar líneas vacías o caracteres sueltos
		if (unwantedRegex.test(trimmedLine)) {
			rta.push(line);
			continue;
		}

		// Separar línea en partes antes de comentarios
		const parts = line.split("//");
		const mainPart = parts[0].trim().replace(";", ""); // Eliminar ; para evitar duplicados

		// Inyección solo si estamos fuera de un contexto de función/callback
		if (contextDepth === 0 && mainPart && !unwantedRegex.test(mainPart)) {
			// Validar si es una expresión ejecutable o invocación
			if (isStandaloneExpression(mainPart)) {
				rta.push(line); // Línea original
				rta.push(`console.log(${mainPart});`); // Inyectar log
				continue;
			}
		}

		// Agregar cualquier otra línea sin modificar
		rta.push(line);
	}

	return rta.join("\n").trim();
}

/**
 * Detecta si una línea es una expresión independiente (invocación de función o cálculo).
 * @param line Código a evaluar.
 * @returns Verdadero si es una expresión ejecutable.
 */
function isStandaloneExpression(line: string): boolean {
	try {
		// Usar `new Function` para detectar si es ejecutable como una expresión
		new Function(`return ${line};`);
		return true;
	} catch {
		return false; // No es una expresión ejecutable
	}
}
