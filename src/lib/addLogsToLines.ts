import { type ExpressionStatement, type Node, parse } from "acorn";
import { ancestor, simple } from "acorn-walk";

/**
 * Agrega logs a un código JavaScript para facilitar la depuración,
 * evitando insertar logs dentro de bloques `{}`, corchetes `[]` u objetos `{}`.
 * Además, evita inyectar logs en expresiones que tienen efectos secundarios,
 * como asignaciones o actualizaciones.
 *
 * @param {string} code Código JavaScript a procesar.
 * @returns {string} Código JavaScript con los logs adicionales.
 */
export function injectLogsIntoCode(code: string): {
  code: string;
  lines: number[];
} {
  const lines = code.split("\n");
  const logs: number[] = [];
  try {
    // Parsear el código a AST
    const ast = parse(code, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
      ranges: true,
      onComment: () => {}, // Evitar la recolección de comentarios si no se necesita
    });

    // Array para almacenar los puntos de inserción
    const insertPoints: { line: number; expr: string }[] = [];

    // Recorrer el AST con acceso a los ancestros
    ancestor(ast, {
      // Manejar únicamente ExpressionStatement
      ExpressionStatement(node, ancestors) {
        if (!node.loc) return;

        // Evitar tipos de expresiones no deseadas al nivel superior
        const excludedTypes = ["UpdateExpression", "AssignmentExpression"];
        const expressionType = node.expression.type;
        if (excludedTypes.includes(expressionType)) return;

        // Verificar si el nodo está dentro de un BlockStatement, ArrayExpression u ObjectExpression
        const isInsideExcludedContext =
          Array.isArray(ancestors) &&
          ancestors.some((ancestor) => {
            return (
              ancestor.type === "BlockStatement" ||
              ancestor.type === "ArrayExpression" ||
              ancestor.type === "ObjectExpression"
            );
          });

        if (isInsideExcludedContext) return;

        // Verificar si la expresión contiene AssignmentExpression o UpdateExpression en cualquier nivel
        if (containsAssignmentOrUpdate(node.expression)) return;

        // Verificar si la expresión contiene una llamada a console.log para evitar duplicados
        if (containsConsoleLog(node.expression)) {
          logs.push(node.loc.start.line);
          return;
        }

        const lineNum = node.loc.end.line;
        const lineRaw = lines[lineNum - 1];

        // Evitar insertar logs en líneas que ya contienen console.log
        if (lineRaw.includes("console.log")) {
          logs.push(node.loc.start.line);
          return;
        }

        // Extraer la parte principal de la expresión
        const mainPart = extractMainExpression(code, node);
        if (!mainPart) return;
        logs.push(node.loc.start.line);
        insertPoints.push({ line: lineNum - 1, expr: mainPart });
      },
    });

    // Ordenar los puntos de inserción de forma descendente para evitar problemas con los índices
    insertPoints.sort((a, b) => b.line - a.line);

    // Insertar console.log() en los puntos identificados
    for (const p of insertPoints) {
      const logStatement = `console.log(${p.expr});`;
      lines.splice(p.line + 1, 0, logStatement);
    }

    return { code: lines.join("\n").trim(), lines: logs };
  } catch (error) {
    console.error("Error al parsear el código:", error);
    return { code, lines: logs }; // Retorna el código original si hay un error de parseo
  }
}

/**
 * Extrae la expresión principal del nodo, manejando casos de expresiones multilínea y comentarios.
 *
 * @param {string} code Código JavaScript original.
 * @param {ExpressionStatement} node Nodo del AST.
 * @returns {string} Expresión extraída.
 */
function extractMainExpression(
  code: string,
  node: ExpressionStatement,
): string {
  // Usar los rangos start y end para extraer la expresión completa
  const expression = code.slice(node.start, node.end).trim();

  // Eliminar comentarios de línea si existen
  const expressionWithoutComments = expression.split("//")[0].trim();

  // Eliminar el punto y coma al final si existe
  const cleanExpression = expressionWithoutComments.replace(/;$/, "");

  return cleanExpression;
}

/**
 * Verifica si una expresión contiene AssignmentExpression o UpdateExpression en cualquier nivel.
 *
 * @param {Node} expression Nodo de expresión a verificar.
 * @returns {boolean} Verdadero si contiene AssignmentExpression o UpdateExpression, falso en caso contrario.
 */
function containsAssignmentOrUpdate(expression: Node): boolean {
  let hasAssignmentOrUpdate = false;

  simple(expression, {
    AssignmentExpression() {
      hasAssignmentOrUpdate = true;
    },
    UpdateExpression() {
      hasAssignmentOrUpdate = true;
    },
  });

  return hasAssignmentOrUpdate;
}

/**
 * Verifica si una expresión contiene una llamada a console.log.
 *
 * @param {Node} expression Nodo de expresión a verificar.
 * @returns {boolean} Verdadero si contiene una llamada a console.log, falso en caso contrario.
 */
function containsConsoleLog(expression: Node): boolean {
  let hasConsoleLog = false;

  simple(expression, {
    CallExpression(node) {
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "console" &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "log"
      ) {
        hasConsoleLog = true;
      }
    },
  });

  return hasConsoleLog;
}
