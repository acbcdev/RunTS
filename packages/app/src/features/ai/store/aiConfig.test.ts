import { describe, expect, it } from "vitest";
import { migrateV0 } from "./aiConfig";

describe("migrateV0", () => {
	it("turns old api keys into providers and keeps the selection", () => {
		const out = migrateV0({
			apiKeys: {
				openai: "",
				anthropic: "sk-ant",
				google: "g-key",
				mistral: "",
			},
			selectedModel: { id: "claude-old", provider: "anthropic" },
		});
		expect(out.providers.map((p) => [p.id, p.preset, p.apiKey])).toEqual([
			["anthropic", "anthropic", "sk-ant"],
			["google", "gemini", "g-key"],
		]);
		expect(out.providers[0].models[0]).toBe("claude-old");
		expect(out.selectedModel).toEqual({
			providerId: "anthropic",
			id: "claude-old",
		});
	});

	it("drops a selection whose provider has no key", () => {
		const out = migrateV0({
			apiKeys: { openai: "" },
			selectedModel: { id: "gpt", provider: "openai" },
		});
		expect(out.providers).toEqual([]);
		expect(out.selectedModel).toEqual({ providerId: null, id: null });
	});
});
