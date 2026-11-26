import { expect, it, vi } from "vitest";

vi.hoisted(() => {
	const items = new Map<string, string>();
	globalThis.localStorage = {
		getItem: (key: string) => items.get(key) ?? null,
		setItem: (key: string, value: string) => items.set(key, value),
		removeItem: (key: string) => items.delete(key),
	} as unknown as Storage;
});

import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { useApparenceStore } from "../appearance-store/appearance";
import { useConfigStore } from "../config-store/config";
import { exportSettings, importSettings } from "./profile";

it("round-trips settings without leaking API keys", () => {
	useAIConfigStore.getState().saveProvider({
		id: "openai",
		kind: "openai-compatible",
		preset: "openai",
		name: "OpenAI",
		baseURL: "",
		apiKey: "sk-secret",
		models: [],
	});
	useConfigStore.getState().setConfigValue("tabSize", 4);
	const profile = exportSettings();
	expect(JSON.stringify(profile)).not.toContain("sk-secret");

	useConfigStore.getState().resetConfig();
	importSettings(JSON.parse(JSON.stringify(profile)));
	expect(useConfigStore.getState().tabSize).toBe(4);
});

it("ignores unknown keys, wrong types and unknown themes", () => {
	importSettings({
		config: { tabSize: "8", evil: true },
		appearance: { theme: "nope", fontSize: 14 },
		ai: { providers: [{ id: "x", apiKey: "stolen" }] },
	});
	expect(useConfigStore.getState().tabSize).not.toBe("8");
	expect(useConfigStore.getState()).not.toHaveProperty("evil");
	expect(useApparenceStore.getState().theme).toBe("oneDark");
	expect(useApparenceStore.getState().fontSize).toBe(14);
	expect(JSON.stringify(useAIConfigStore.getState().providers)).not.toContain(
		"stolen",
	);
	expect(() => importSettings("garbage")).toThrow();
});
