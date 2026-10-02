// Generar una clave criptográfica
export async function generateKey(): Promise<CryptoKey> {
	return await crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256, // Tamaño de clave en bits
		},
		true, // La clave es exportable
		["encrypt", "decrypt"],
	);
}

// Exportar clave a formato JSON para almacenamiento
export async function exportKey(key: CryptoKey): Promise<string> {
	const exportedKey = await crypto.subtle.exportKey("jwk", key);
	return JSON.stringify(exportedKey);
}

// Importar clave desde formato JSON
export async function importKey(jsonKey: string): Promise<CryptoKey> {
	return await crypto.subtle.importKey(
		"jwk",
		JSON.parse(jsonKey),
		{
			name: "AES-GCM",
		},
		true,
		["encrypt", "decrypt"],
	);
}

// Cifrar datos
export async function encryptData(
	data: string,
	key: CryptoKey,
): Promise<string> {
	const encoder = new TextEncoder();
	const encodedData = encoder.encode(data);
	const iv = crypto.getRandomValues(new Uint8Array(12)); // Vector de inicialización (IV)
	const encrypted = await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv, // IV necesario para descifrar
		},
		key,
		encodedData,
	);

	return `${toBase64(iv)}:${toBase64(new Uint8Array(encrypted))}`;
}

// Chunked: spreading a large array into fromCharCode overflows the stack
function toBase64(bytes: Uint8Array): string {
	let binary = "";
	for (let i = 0; i < bytes.length; i += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	}
	return btoa(binary);
}

// Descifrar datos
export async function decryptData(
	encryptedData: string,
	key: CryptoKey,
): Promise<string> {
	// Validate format
	const parts = encryptedData.split(":");
	if (parts.length !== 2) {
		throw new Error("Invalid encrypted data format: missing IV separator");
	}

	const [ivBase64, encryptedBase64] = parts;

	try {
		const iv = Uint8Array.from(atob(ivBase64), (char) => char.charCodeAt(0));
		const encrypted = Uint8Array.from(atob(encryptedBase64), (char) =>
			char.charCodeAt(0),
		);

		const decrypted = await crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
			},
			key,
			encrypted,
		);

		const decoder = new TextDecoder();
		return decoder.decode(decrypted);
	} catch (error) {
		throw new Error(
			`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

const KEY_STORAGE = "aiEncryptionKey";

// Random key created once and reused. A browser fingerprint (UA, screen, timezone)
// changes over time and makes stored data undecryptable.
// ponytail: key sits next to the ciphertext, so this is obfuscation, not real secrecy
export async function getDerivedKey(): Promise<CryptoKey> {
	const saved = localStorage.getItem(KEY_STORAGE);
	if (saved) return importKey(saved);
	const key = await generateKey();
	localStorage.setItem(KEY_STORAGE, await exportKey(key));
	return key;
}
