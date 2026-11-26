import { useAIConfigStore } from "@/features/ai/store/aiConfig";
import { themes } from "@/features/common/themes";
import { useEditorStore } from "@/features/editor/editor-store/editor";
import { useApparenceStore } from "../appearance-store/appearance";
import { useConfigStore } from "../config-store/config";

// ponytail: API keys and chat messages never leave the device.
const stores = {
	appearance: useApparenceStore,
	config: useConfigStore,
	editor: useEditorStore,
	ai: useAIConfigStore,
} as const;
const keys: Record<keyof typeof stores, string[]> = {
	appearance: ["theme", "fontSize", "fontFamily", "radius", "layout", "side"],
	config: Object.keys(useConfigStore.getInitialState()).filter(
		(key) =>
			typeof useConfigStore.getInitialState()[key as never] !== "function",
	),
	editor: ["expression", "alignLogs"],
	ai: ["contextFile", "customInstructions"],
};

type Profile = Record<string, Record<string, unknown>>;

export function exportSettings(): Profile {
	const profile: Profile = {};
	for (const [name, store] of Object.entries(stores)) {
		const state = store.getState() as Record<string, unknown>;
		profile[name] = Object.fromEntries(
			keys[name as keyof typeof stores].map((key) => [key, state[key]]),
		);
	}
	return profile;
}

// Untrusted file: copy only known keys whose type matches the default.
export function importSettings(profile: unknown) {
	if (!profile || typeof profile !== "object") throw new Error("Invalid file");
	for (const [name, store] of Object.entries(stores)) {
		const section = (profile as Profile)[name];
		if (!section || typeof section !== "object") continue;
		const initial = store.getInitialState() as Record<string, unknown>;
		const updates = Object.fromEntries(
			keys[name as keyof typeof stores]
				.filter((key) => typeof section[key] === typeof initial[key])
				.map((key) => [key, section[key]]),
		);
		if (name === "appearance" && !(String(updates.theme) in themes))
			delete updates.theme;
		store.setState(updates);
	}
}
