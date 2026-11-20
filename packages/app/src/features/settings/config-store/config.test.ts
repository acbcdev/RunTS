import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetModules();
});

function storage(state?: Record<string, unknown>) {
	const items = new Map<string, string>();
	if (state)
		items.set("config-editor-store", JSON.stringify({ state, version: 0 }));
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => items.get(key) ?? null,
		setItem: (key: string, value: string) => items.set(key, value),
		removeItem: (key: string) => items.delete(key),
	});
	return items;
}

it("adds inline mode to existing preferences without resetting other settings", async () => {
	storage({ lineNumbers: false, refreshTime: 500 });
	const { useConfigStore } = await import("./config");
	expect(useConfigStore.getState().consoleMode).toBe("inline");
	expect(useConfigStore.getState().lineNumbers).toBe(false);
	expect(useConfigStore.getState().refreshTime).toBe(500);
});

it("persists all three console modes and restores inline on reset", async () => {
	const items = storage();
	const { useConfigStore } = await import("./config");
	for (const mode of ["inspector", "by-source", "inline"] as const) {
		useConfigStore.getState().setConfigValue("consoleMode", mode);
		expect(
			JSON.parse(items.get("config-editor-store") ?? "{}").state.consoleMode,
		).toBe(mode);
	}
	useConfigStore.getState().setConfigValue("consoleMode", "inspector");
	useConfigStore.getState().resetConfig();
	expect(useConfigStore.getState().consoleMode).toBe("inline");
});
