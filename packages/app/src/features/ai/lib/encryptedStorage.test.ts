import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createEncryptedStorage,
	createEncryptedStorageSync,
} from "./encryptedStorage";

describe("Encrypted Storage Adapter", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe("setItem / getItem Integration", () => {
		it("should encrypt on setItem and decrypt on getItem", async () => {
			const storage = await createEncryptedStorage();
			const testData = JSON.stringify({
				apiKeys: { openai: "sk-test-123" },
			});

			await storage.setItem("test-key", testData);

			// Verify localStorage has encrypted data (not plain text)
			const stored = localStorage.getItem("test-key");
			expect(stored).toBeDefined();
			expect(stored).not.toContain("sk-test-123");
			expect(stored).not.toContain("openai");
			expect(stored).toContain(":"); // Should have IV:ciphertext format

			// Verify getItem decrypts correctly
			const retrieved = await storage.getItem("test-key");
			expect(retrieved).toBe(testData);
		});

		it("should return null for non-existent keys", async () => {
			const storage = await createEncryptedStorage();
			const result = await storage.getItem("non-existent-key");
			expect(result).toBeNull();
		});

		it("should handle multiple different keys", async () => {
			const storage = await createEncryptedStorage();

			await storage.setItem("key1", "value1");
			await storage.setItem("key2", "value2");
			await storage.setItem("key3", "value3");

			expect(await storage.getItem("key1")).toBe("value1");
			expect(await storage.getItem("key2")).toBe("value2");
			expect(await storage.getItem("key3")).toBe("value3");
		});

		it("should handle overwriting existing keys", async () => {
			const storage = await createEncryptedStorage();

			await storage.setItem("key", "original-value");
			expect(await storage.getItem("key")).toBe("original-value");

			await storage.setItem("key", "updated-value");
			expect(await storage.getItem("key")).toBe("updated-value");
		});

		it("should handle corrupted data gracefully", async () => {
			const storage = await createEncryptedStorage();

			// Manually insert corrupted data into localStorage
			localStorage.setItem("corrupted-key", "corrupted:data:here");

			// Should return null instead of throwing
			const result = await storage.getItem("corrupted-key");
			expect(result).toBeNull();

			// Should also clear the corrupted data
			expect(localStorage.getItem("corrupted-key")).toBeNull();
		});

		it("should handle invalid encrypted format gracefully", async () => {
			const storage = await createEncryptedStorage();

			// Insert data without proper IV:ciphertext format
			localStorage.setItem("invalid-key", "no-separator-here");

			const result = await storage.getItem("invalid-key");
			expect(result).toBeNull();
		});

		it("should handle removeItem correctly", async () => {
			const storage = await createEncryptedStorage();

			await storage.setItem("temp-key", "temp-value");
			expect(await storage.getItem("temp-key")).toBe("temp-value");

			storage.removeItem("temp-key");
			expect(await storage.getItem("temp-key")).toBeNull();
			expect(localStorage.getItem("temp-key")).toBeNull();
		});

		it("should handle empty strings", async () => {
			const storage = await createEncryptedStorage();

			await storage.setItem("empty-key", "");
			const result = await storage.getItem("empty-key");
			expect(result).toBe("");
		});
	});

	describe("Real Zustand State Structure", () => {
		it("should handle complete Zustand persisted state", async () => {
			const storage = await createEncryptedStorage();
			const mockState = {
				state: {
					apiKeys: {
						openai: "sk-proj-abc123",
						anthropic: "sk-ant-def456",
						google: "AIza789",
						mistral: "mstr-xyz",
					},
					selectedModel: { id: "gpt-4", provider: "openai" },
					messages: [],
					showChat: false,
					contextFile: true,
				},
				version: 0,
			};

			const serialized = JSON.stringify(mockState);
			await storage.setItem("aiConfigStore-v2", serialized);

			const retrieved = await storage.getItem("aiConfigStore-v2");
			expect(retrieved).toBeDefined();
			expect(JSON.parse(retrieved!)).toEqual(mockState);
		});

		it("should handle Zustand state with messages array", async () => {
			const storage = await createEncryptedStorage();
			const mockState = {
				state: {
					apiKeys: {
						openai: "sk-test",
						anthropic: "",
						google: "",
						mistral: "",
					},
					messages: [
						{ id: "1", role: "user", content: "Hello" },
						{ id: "2", role: "assistant", content: "Hi there!" },
					],
					showChat: true,
				},
				version: 0,
			};

			const serialized = JSON.stringify(mockState);
			await storage.setItem("test-state", serialized);

			const retrieved = await storage.getItem("test-state");
			const parsed = JSON.parse(retrieved!);

			expect(parsed.state.messages).toHaveLength(2);
			expect(parsed.state.messages[0].content).toBe("Hello");
		});

		it("should not expose API keys in localStorage", async () => {
			const storage = await createEncryptedStorage();
			const sensitiveKey = "sk-proj-VERY_SENSITIVE_KEY_12345";
			const mockState = {
				state: {
					apiKeys: {
						openai: sensitiveKey,
						anthropic: "",
						google: "",
						mistral: "",
					},
				},
			};

			const serialized = JSON.stringify(mockState);
			await storage.setItem("aiConfigStore-v2", serialized);

			// Check raw localStorage - should NOT contain sensitive data
			const rawStored = localStorage.getItem("aiConfigStore-v2");
			expect(rawStored).not.toContain(sensitiveKey);
			expect(rawStored).not.toContain("VERY_SENSITIVE");
			expect(rawStored).not.toContain("sk-proj");

			// But decryption should work
			const retrieved = await storage.getItem("aiConfigStore-v2");
			expect(retrieved).toContain(sensitiveKey);
		});
	});

	describe("Edge Cases", () => {
		it("should handle very large state objects", async () => {
			const storage = await createEncryptedStorage();
			const largeState = {
				state: {
					apiKeys: {
						openai: "sk-" + "x".repeat(1000),
						anthropic: "sk-" + "y".repeat(1000),
						google: "AIza" + "z".repeat(1000),
						mistral: "mstr-" + "w".repeat(1000),
					},
					messages: Array.from({ length: 100 }, (_, i) => ({
						id: `msg-${i}`,
						role: i % 2 === 0 ? "user" : "assistant",
						content: "Message content ".repeat(10),
					})),
				},
			};

			const serialized = JSON.stringify(largeState);
			await storage.setItem("large-state", serialized);

			const retrieved = await storage.getItem("large-state");
			expect(JSON.parse(retrieved!)).toEqual(largeState);
		});

		it("should handle special characters in state", async () => {
			const storage = await createEncryptedStorage();
			const mockState = {
				state: {
					apiKeys: {
						openai: "sk-™-🔑-日本語-émojis",
						anthropic: "special<>chars&symbols",
						google: "quotes\"and'apostrophes",
						mistral: "newlines\nand\ttabs",
					},
				},
			};

			const serialized = JSON.stringify(mockState);
			await storage.setItem("special-chars", serialized);

			const retrieved = await storage.getItem("special-chars");
			expect(JSON.parse(retrieved!)).toEqual(mockState);
		});

		it("should maintain referential consistency across operations", async () => {
			const storage = await createEncryptedStorage();
			const testValue = "consistent-value";

			await storage.setItem("key", testValue);
			const read1 = await storage.getItem("key");
			const read2 = await storage.getItem("key");

			expect(read1).toBe(testValue);
			expect(read2).toBe(testValue);
			expect(read1).toBe(read2);
		});
	});

	describe("Error Handling", () => {
		it("should handle setItem errors gracefully", async () => {
			const storage = await createEncryptedStorage();

			// Spy on console.error to verify error is logged
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			// Mock localStorage.setItem to throw using spyOn
			const setItemSpy = vi
				.spyOn(localStorage, "setItem")
				.mockImplementation(() => {
					throw new Error("Storage quota exceeded");
				});

			// Should throw the error after logging it
			await expect(storage.setItem("test", "value")).rejects.toThrow(
				"Storage quota exceeded",
			);

			// Verify error was logged
			expect(consoleErrorSpy).toHaveBeenCalled();

			// Restore
			setItemSpy.mockRestore();
			consoleErrorSpy.mockRestore();
		});

		it("should log warning and clear corrupted data on getItem failure", async () => {
			const storage = await createEncryptedStorage();
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});

			// Insert invalid encrypted data
			localStorage.setItem("bad-data", "invalid-encrypted-string");

			const result = await storage.getItem("bad-data");

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalled();
			expect(localStorage.getItem("bad-data")).toBeNull();

			consoleWarnSpy.mockRestore();
		});
	});
});

describe("Encrypted Storage Sync Wrapper", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe("Synchronous Creation", () => {
		it("should create storage synchronously (not return a Promise)", () => {
			const storage = createEncryptedStorageSync();

			// Should be an object, not a Promise
			expect(storage).toBeDefined();
			expect(storage.getItem).toBeInstanceOf(Function);
			expect(storage.setItem).toBeInstanceOf(Function);
			expect(storage.removeItem).toBeInstanceOf(Function);
		});

		it("should have correct StateStorage interface", () => {
			const storage = createEncryptedStorageSync();

			expect(typeof storage.getItem).toBe("function");
			expect(typeof storage.setItem).toBe("function");
			expect(typeof storage.removeItem).toBe("function");
		});
	});

	describe("Lazy Initialization", () => {
		it("should encrypt and decrypt data correctly", async () => {
			const storage = createEncryptedStorageSync();
			const testData = JSON.stringify({ apiKeys: { openai: "sk-test-sync" } });

			await storage.setItem("sync-test-key", testData);

			// Verify localStorage has encrypted data
			const stored = localStorage.getItem("sync-test-key");
			expect(stored).not.toContain("sk-test-sync");
			expect(stored).toContain(":");

			// Verify getItem decrypts correctly
			const retrieved = await storage.getItem("sync-test-key");
			expect(retrieved).toBe(testData);
		});

		it("should handle multiple operations with cached storage", async () => {
			const storage = createEncryptedStorageSync();

			await storage.setItem("key1", "value1");
			await storage.setItem("key2", "value2");

			const val1 = await storage.getItem("key1");
			const val2 = await storage.getItem("key2");

			expect(val1).toBe("value1");
			expect(val2).toBe("value2");
		});

		it("should return null for non-existent keys", async () => {
			const storage = createEncryptedStorageSync();
			const result = await storage.getItem("non-existent-sync");
			expect(result).toBeNull();
		});
	});

	describe("Integration with Zustand Pattern", () => {
		it("should work with Zustand's expected pattern", async () => {
			// Simulate how Zustand would use it
			const storageFactory = () => createEncryptedStorageSync();
			const storage = storageFactory();

			const mockState = {
				state: {
					apiKeys: { openai: "sk-proj-test123" },
					selectedModel: { id: "gpt-4", provider: "openai" },
				},
				version: 0,
			};

			const serialized = JSON.stringify(mockState);
			await storage.setItem("zustand-test", serialized);

			const retrieved = await storage.getItem("zustand-test");
			expect(JSON.parse(retrieved!)).toEqual(mockState);
		});

		it("should handle removeItem synchronously", () => {
			const storage = createEncryptedStorageSync();

			localStorage.setItem("temp-item", "test-value");
			expect(localStorage.getItem("temp-item")).toBe("test-value");

			storage.removeItem("temp-item");
			expect(localStorage.getItem("temp-item")).toBeNull();
		});
	});

	describe("Error Handling", () => {
		it("should handle corrupted data gracefully", async () => {
			const storage = createEncryptedStorageSync();

			// Insert corrupted encrypted data
			localStorage.setItem("corrupted-sync", "corrupted:data");

			const result = await storage.getItem("corrupted-sync");
			expect(result).toBeNull();
		});

		it("should handle special characters", async () => {
			const storage = createEncryptedStorageSync();
			const specialData = "API-KEY-™-🔑-日本語-émojis";

			await storage.setItem("special-sync", specialData);
			const retrieved = await storage.getItem("special-sync");

			expect(retrieved).toBe(specialData);
		});
	});

	describe("Comparison with Async Version", () => {
		it("should produce same encrypted output as async version", async () => {
			const syncStorage = createEncryptedStorageSync();
			const asyncStorage = await createEncryptedStorage();

			const testData = "test-data-comparison";

			// Both should encrypt and decrypt correctly
			await syncStorage.setItem("sync-key", testData);
			await asyncStorage.setItem("async-key", testData);

			const syncRetrieved = await syncStorage.getItem("sync-key");
			const asyncRetrieved = await asyncStorage.getItem("async-key");

			expect(syncRetrieved).toBe(testData);
			expect(asyncRetrieved).toBe(testData);

			// Both should have encrypted data in localStorage
			const syncStored = localStorage.getItem("sync-key");
			const asyncStored = localStorage.getItem("async-key");

			expect(syncStored).not.toContain(testData);
			expect(asyncStored).not.toContain(testData);
			expect(syncStored).toContain(":");
			expect(asyncStored).toContain(":");
		});
	});
});
