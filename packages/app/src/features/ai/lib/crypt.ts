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

  // Convert to base64 without using Buffer (browser-compatible)
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const encryptedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encrypted)),
  );

  return `${ivBase64}:${encryptedBase64}`;
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

// Generate a deterministic key from browser fingerprint
export async function getDerivedKey(): Promise<CryptoKey> {
  // Gather browser/device characteristics for fingerprinting
  const fingerprint = [
    navigator.userAgent || "unknown-agent",
    navigator.language || "en-US",
    screen.width?.toString() || "0",
    screen.height?.toString() || "0",
    new Date().getTimezoneOffset().toString(),
    // Add more stable characteristics
    navigator.hardwareConcurrency?.toString() || "0",
    navigator.maxTouchPoints?.toString() || "0",
  ].join("|");

  // Hash the fingerprint to create key material
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Import the hash as an AES-GCM key
  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-GCM" },
    false, // Not exportable for security
    ["encrypt", "decrypt"],
  );
}
