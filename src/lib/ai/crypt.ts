// Generar una clave criptográfica
async function generateKey(): Promise<CryptoKey> {
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
async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exportedKey);
}

// Importar clave desde formato JSON
async function importKey(jsonKey: string): Promise<CryptoKey> {
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
async function encryptData(data: string, key: CryptoKey): Promise<string> {
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
  return `${Buffer.from(iv).toString("base64")}:${Buffer.from(encrypted).toString("base64")}`;
}

// Descifrar datos
async function decryptData(
  encryptedData: string,
  key: CryptoKey,
): Promise<string> {
  const [ivBase64, encryptedBase64] = encryptedData.split(":");
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
}

// Ejemplo de uso
(async () => {
  // Generar o importar clave
  const key = await generateKey();

  // Exportar clave para guardar en almacenamiento local
  const exportedKey = await exportKey(key);
  console.log("Clave exportada:", exportedKey);

  // Importar clave desde almacenamiento
  const importedKey = await importKey(exportedKey);

  // Cifrar y descifrar datos
  const data = "Mi clave API de OpenAI";
  const encrypted = await encryptData(data, importedKey);
  console.log("Cifrado:", encrypted);

  const decrypted = await decryptData(encrypted, importedKey);
  console.log("Descifrado:", decrypted);
})();
