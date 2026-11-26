import { afterEach, beforeEach, vi } from "vitest";

export function installTestStorage() {
	beforeEach(() => {
		const data = new Map<string, string>();
		const storage: Storage = {
			get length() {
				return data.size;
			},
			clear: () => data.clear(),
			getItem: (key) => data.get(key) ?? null,
			key: (index) => Array.from(data.keys())[index] ?? null,
			removeItem: (key) => {
				data.delete(key);
			},
			setItem: (key, value) => {
				data.set(key, value);
			},
		};
		vi.stubGlobal("localStorage", storage);
	});
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});
}
