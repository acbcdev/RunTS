export type Value = {
	type: string;
	text: string;
	children?: [string, Value][];
};

export type Entry = {
	id: number;
	method: string;
	line: number;
	values: Value[];
	depth: number;
	group?: number;
	collapsed?: boolean;
	columns?: string[];
};

export const sample = `// Una consola que conserva tus datos.
const users = [
  { name: "Ana", role: "Developer", active: true },
  { name: "Luis", role: "Designer", active: false },
  { name: "Marta", role: "Developer", active: true },
];

console.info("Playground listo");
console.log("Usuarios:", users.length);
console.table(users);

console.group("Procesamiento");
console.time("filter");
const active = users.filter(user => user.active);
console.log("Activos:", active.map(user => user.name));
console.timeLog("filter");
console.timeEnd("filter");
console.groupEnd();

console.warn("Luis todavía no ha verificado su cuenta");
console.error("No se pudo sincronizar el perfil");
console.dir({ name: "XJS User", age: 25,
  skills: ["JavaScript", "TypeScript", "React"] });
console.log(new Map([["theme", "dark"], ["fontSize", 16]]));
console.log(new Set(["read", "write"]), 42n, undefined, null);
console.log(Promise.resolve("ready"));

for (let i = 0; i < 3; i++) console.count("render");
console.countReset("render");
console.assert(active.length === 3, "Esperábamos 3 usuarios activos");
console.debug("Filtro aplicado", { total: users.length });
console.trace("Origen de la sincronización");
console.groupCollapsed("Metadatos");
console.log(new Date("2026-11-19T12:00:00Z"), /runts/gi);
console.groupEnd();`;
