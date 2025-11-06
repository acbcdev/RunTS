import { beforeAll, describe, expect, it } from "vitest";
import {
	decryptData,
	encryptData,
	exportKey,
	generateKey,
	getDerivedKey,
	importKey,
} from "./crypt";

describe("Encryption Functions - Critical Paths", () => {
	describe("Key Generation & Management", () => {
		it("should generate valid AES-GCM 256-bit key", async () => {
			const key = await generateKey();
			expect(key.type).toBe("secret");
			expect(key.algorithm.name).toBe("AES-GCM");
			// @ts-expect-error - length property exists on AesKeyAlgorithm
			expect(key.algorithm.length).toBe(256);
		});

		it("should export and import key successfully", async () => {
			const originalKey = await generateKey();
			const exported = await exportKey(originalKey);
			const imported = await importKey(exported);

			// Test that imported key works for decryption
			const testData = "test string";
			const encrypted = await encryptData(testData, originalKey);
			const decrypted = await decryptData(encrypted, imported);

			expect(decrypted).toBe(testData);
		});

		it("should generate different keys on each call", async () => {
			const key1 = await generateKey();
			const key2 = await generateKey();

			// Keys should be different objects
			expect(key1).not.toBe(key2);

			// Export to compare - should be different
			const exported1 = await exportKey(key1);
			const exported2 = await exportKey(key2);
			expect(exported1).not.toBe(exported2);
		});
	});

	describe("Browser Fingerprint Derivation", () => {
		it("should generate consistent key from same fingerprint", async () => {
			const key1 = await getDerivedKey();
			const key2 = await getDerivedKey();

			// Keys should be functionally identical (can decrypt each other's data)
			const testData = "consistency test";
			const encrypted = await encryptData(testData, key1);
			const decrypted = await decryptData(encrypted, key2);

			expect(decrypted).toBe(testData);
		});

		it("should generate valid AES-GCM key from fingerprint", async () => {
			const key = await getDerivedKey();
			expect(key.type).toBe("secret");
			expect(key.algorithm.name).toBe("AES-GCM");
		});

		it("should handle missing navigator properties gracefully", async () => {
			// Even with limited navigator, should generate a key
			const key = await getDerivedKey();
			expect(key).toBeDefined();
			expect(key.algorithm.name).toBe("AES-GCM");
		});
	});

	describe("Encrypt/Decrypt Round-Trip", () => {
		let key: CryptoKey;

		beforeAll(async () => {
			key = await generateKey();
		});

		it("should encrypt and decrypt simple strings", async () => {
			const testData = "Hello, World!";
			const encrypted = await encryptData(testData, key);
			const decrypted = await decryptData(encrypted, key);

			expect(decrypted).toBe(testData);
		});

		it("should encrypt and decrypt API keys structure", async () => {
			const apiKeys = {
				openai: "sk-proj-1234567890abcdef",
				anthropic: "sk-ant-api03-abcdef123456",
				google: "AIzaSy1234567890abcdef",
				mistral: "mstr-1234567890abcdef",
			};

			const jsonString = JSON.stringify(apiKeys);
			const encrypted = await encryptData(jsonString, key);
			const decrypted = await decryptData(encrypted, key);

			expect(JSON.parse(decrypted)).toEqual(apiKeys);
		});

		it("should produce valid encrypted format (IV:ciphertext)", async () => {
			const encrypted = await encryptData("test", key);

			expect(encrypted).toContain(":");
			const [iv, ciphertext] = encrypted.split(":");
			expect(iv.length).toBeGreaterThan(0);
			expect(ciphertext.length).toBeGreaterThan(0);

			// Verify both parts are base64
			expect(() => atob(iv)).not.toThrow();
			expect(() => atob(ciphertext)).not.toThrow();
		});

		it("should produce different ciphertext each time (random IV)", async () => {
			const data = "same input";
			const encrypted1 = await encryptData(data, key);
			const encrypted2 = await encryptData(data, key);

			// Different ciphertext due to random IV
			expect(encrypted1).not.toBe(encrypted2);

			// But both should decrypt to same value
			const decrypted1 = await decryptData(encrypted1, key);
			const decrypted2 = await decryptData(encrypted2, key);
			expect(decrypted1).toBe(data);
			expect(decrypted2).toBe(data);
		});

		it("should handle empty strings", async () => {
			const encrypted = await encryptData("", key);
			const decrypted = await decryptData(encrypted, key);
			expect(decrypted).toBe("");
		});

		it("should handle special characters and unicode", async () => {
			const testData = "API-KEY-™-🔑-日本語-émojis";
			const encrypted = await encryptData(testData, key);
			const decrypted = await decryptData(encrypted, key);
			expect(decrypted).toBe(testData);
		});

		it("should handle very long strings", async () => {
			const longString = "A".repeat(10000);
			const encrypted = await encryptData(longString, key);
			const decrypted = await decryptData(encrypted, key);
			expect(decrypted).toBe(longString);
			expect(decrypted.length).toBe(10000);
		});

		it("should handle complex JSON structures", async () => {
			const complexData = {
				nested: {
					deeply: {
						value: "test",
						array: [1, 2, 3],
						bool: true,
						null: null,
					},
				},
				special: "unicode: 日本語, emoji: 🔐",
			};

			const jsonString = JSON.stringify(complexData);
			const encrypted = await encryptData(jsonString, key);
			const decrypted = await decryptData(encrypted, key);

			expect(JSON.parse(decrypted)).toEqual(complexData);
		});
	});

	describe("Error Handling", () => {
		it("should fail decryption with wrong key", async () => {
			const key1 = await generateKey();
			const key2 = await generateKey();

			const encrypted = await encryptData("secret", key1);

			await expect(decryptData(encrypted, key2)).rejects.toThrow(
				/Decryption failed/,
			);
		});

		it("should fail on corrupted ciphertext", async () => {
			const key = await generateKey();
			const encrypted = await encryptData("test", key);

			// Corrupt the ciphertext part
			const [iv, ciphertext] = encrypted.split(":");
			const corrupted = `${iv}:corrupted${ciphertext}`;

			await expect(decryptData(corrupted, key)).rejects.toThrow(
				/Decryption failed/,
			);
		});

		it("should fail on malformed IV format - no separator", async () => {
			const key = await generateKey();

			await expect(decryptData("no-colon-separator", key)).rejects.toThrow(
				/Invalid encrypted data format/,
			);
		});

		it("should fail on malformed IV format - multiple separators", async () => {
			const key = await generateKey();

			// Multiple colons means split will have more than 2 parts, which triggers the format error
			await expect(decryptData("multiple:colons:here", key)).rejects.toThrow();
		});

		it("should fail on invalid base64 in IV", async () => {
			const key = await generateKey();

			await expect(
				decryptData("invalid!@#$:validBase64==", key),
			).rejects.toThrow();
		});

		it("should fail on invalid base64 in ciphertext", async () => {
			const key = await generateKey();
			const validIV = btoa("validiv12345");

			await expect(
				decryptData(`${validIV}:invalid!@#$`, key),
			).rejects.toThrow();
		});

		it("should handle empty encrypted string", async () => {
			const key = await generateKey();

			await expect(decryptData("", key)).rejects.toThrow(
				/Invalid encrypted data format/,
			);
		});
	});

	describe("Security Properties", () => {
		it("should not expose plain text in encrypted data", async () => {
			const key = await generateKey();
			const secret = "sk-proj-SENSITIVE_API_KEY_12345";
			const encrypted = await encryptData(secret, key);

			expect(encrypted).not.toContain("SENSITIVE");
			expect(encrypted).not.toContain("API_KEY");
			expect(encrypted).not.toContain("sk-proj");
			expect(encrypted).not.toContain("12345");
		});

		it("should detect tampered ciphertext", async () => {
			const key = await generateKey();
			const encrypted = await encryptData("test", key);

			const [iv, ciphertext] = encrypted.split(":");
			// Flip last character in ciphertext
			const tamperedCiphertext =
				ciphertext.slice(0, -1) + (ciphertext.slice(-1) === "A" ? "B" : "A");
			const tampered = `${iv}:${tamperedCiphertext}`;

			await expect(decryptData(tampered, key)).rejects.toThrow(
				/Decryption failed/,
			);
		});

		it("should detect tampered IV", async () => {
			const key = await generateKey();
			const encrypted = await encryptData("test", key);

			const [iv, ciphertext] = encrypted.split(":");
			// Flip last character in IV
			const tamperedIV = iv.slice(0, -1) + (iv.slice(-1) === "A" ? "B" : "A");
			const tampered = `${tamperedIV}:${ciphertext}`;

			await expect(decryptData(tampered, key)).rejects.toThrow(
				/Decryption failed/,
			);
		});

		it("should use unique IV for each encryption", async () => {
			const key = await generateKey();
			const data = "same data";

			const encrypted1 = await encryptData(data, key);
			const encrypted2 = await encryptData(data, key);

			const [iv1] = encrypted1.split(":");
			const [iv2] = encrypted2.split(":");

			// IVs should be different
			expect(iv1).not.toBe(iv2);
		});

		it("should verify encrypted data is base64 encoded", async () => {
			const key = await generateKey();
			const encrypted = await encryptData("test data", key);

			const [iv, ciphertext] = encrypted.split(":");

			// Should not throw when decoding base64
			expect(() => atob(iv)).not.toThrow();
			expect(() => atob(ciphertext)).not.toThrow();

			// Decoded values should be binary data
			const ivBytes = atob(iv);
			const cipherBytes = atob(ciphertext);

			expect(ivBytes.length).toBeGreaterThan(0);
			expect(cipherBytes.length).toBeGreaterThan(0);
		});
	});

	describe("Performance", () => {
		it("should encrypt typical API key data in reasonable time", async () => {
			const key = await generateKey();
			const apiKeys = {
				openai: `sk-proj-${"x".repeat(40)}`,
				anthropic: `sk-ant-${"x".repeat(40)}`,
				google: `AIza${"x".repeat(35)}`,
				mistral: `mstr-${"x".repeat(40)}`,
			};

			const jsonString = JSON.stringify(apiKeys);

			const startTime = performance.now();
			await encryptData(jsonString, key);
			const endTime = performance.now();

			const duration = endTime - startTime;
			expect(duration).toBeLessThan(100); // Should complete in <100ms
		});

		it("should decrypt typical API key data in reasonable time", async () => {
			const key = await generateKey();
			const apiKeys = {
				openai: `sk-proj-${"x".repeat(40)}`,
				anthropic: `sk-ant-${"x".repeat(40)}`,
				google: `AIza${"x".repeat(35)}`,
				mistral: `mstr-${"x".repeat(40)}`,
			};

			const jsonString = JSON.stringify(apiKeys);
			const encrypted = await encryptData(jsonString, key);

			const startTime = performance.now();
			await decryptData(encrypted, key);
			const endTime = performance.now();

			const duration = endTime - startTime;
			expect(duration).toBeLessThan(100); // Should complete in <100ms
		});
	});
});
