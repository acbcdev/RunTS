import { parse } from "acorn";
import { simple } from "acorn-walk";

/**
 * Agrega logs a un código JavaScript para facilitar la depuración.
 *
 * El algoritmo funciona de la siguiente manera:
 * 1. Parsea el código en un AST (Abstract Syntax Tree) usando acorn.
 * 2. Itera sobre el AST y encuentra las declaraciones de variables y llamadas a funciones.
 * 3. Por cada una de ellas, extrae la expresión principal y la inyecta como parámetro de console.log().
 * 4. Inserta la nueva línea en el lugar correspondiente en el código original.
 * 5. Si hubo un error de parseo, se devuelve el código original.
 *
 * @param {string} code Código JavaScript a procesar.
 * @returns {string} Código JavaScript con los logs adicionales.
 */
export function injectLogsIntoCode(code: string): string {
  // Preprocesar líneas para remover el prefijo &&&
  const lines = code.split("\n");

  try {
    // Parsear el código a AST
    const ast = parse(code, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
    });
    const insertPoints: { line: number; expr: string }[] = [];

    simple(ast, {
      ExpressionStatement(node) {
        if (!node.loc) return;
        if (node.expression.type === "UpdateExpression") return;
        const lineNum = node.loc.end.line;
        const lineRaw = lines[lineNum - 1];

        const mainPart = lineRaw.split("//")[0].trim().replace(/;$/, "");
        if (!mainPart || mainPart.startsWith("console.")) return;

        insertPoints.push({ line: lineNum - 1, expr: mainPart });
      },
    });

    // Insertar console.log() con límite maxLogs
    let offset = 0;
    let logsInserted = 0;
    for (const p of insertPoints) {
      lines.splice(p.line + 1 + offset, 0, `console.log(${p.expr});`);
      offset++;
      logsInserted++;
    }

    return lines.join("\n").trim();
  } catch (error) {
    console.error("Error al parsear el código:", error);
    return code; // Retorna el código original si hay un error de parseo
  }
}
