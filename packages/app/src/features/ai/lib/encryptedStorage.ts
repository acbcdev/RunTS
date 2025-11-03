import type { StateStorage } from "zustand/middleware";
import { decryptData, encryptData, getDerivedKey } from "./crypt";

/**
 * Creates an encrypted storage adapter for Zustand persist middleware.
 * Encrypts data before writing to localStorage and decrypts on read.
 *
 * @returns StateStorage object compatible with Zustand persist middleware
 */
export async function createEncryptedStorage(): Promise<StateStorage> {
  // Generate encryption key from browser fingerprint
  const cryptoKey = await getDerivedKey();

  return {
    /**
     * Encrypts and stores data in localStorage
     */
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        const encrypted = await encryptData(value, cryptoKey);
        localStorage.setItem(name, encrypted);
      } catch (error) {
        console.error("Failed to encrypt and store data:", error);
        throw error;
      }
    },

    /**
     * Retrieves and decrypts data from localStorage
     * Returns null if key doesn't exist or decryption fails
     */
    getItem: async (name: string): Promise<string | null> => {
      try {
        const encrypted = localStorage.getItem(name);
        if (!encrypted) {
          return null;
        }

        // Try to decrypt
        const decrypted = await decryptData(encrypted, cryptoKey);
        return decrypted;
      } catch (error) {
        // Decryption failed - data is corrupted or key changed
        console.warn(
          `Failed to decrypt data for key "${name}". Returning null.`,
          error,
        );
        // Optionally clear corrupted data
        localStorage.removeItem(name);
        return null;
      }
    },

    /**
     * Removes item from localStorage
     */
    removeItem: (name: string): void => {
      localStorage.removeItem(name);
    },
  };
}

/**
 * Creates a synchronous encrypted storage adapter for Zustand persist middleware.
 * This wrapper lazily initializes the async encryption on first use.
 *
 * Use this with createJSONStorage(() => createEncryptedStorageSync())
 *
 * @returns StateStorage object that can be used synchronously with Zustand
 */
export function createEncryptedStorageSync(): StateStorage {
  let storagePromise: Promise<StateStorage> | null = null;

  const getStorage = async (): Promise<StateStorage> => {
    if (!storagePromise) {
      storagePromise = createEncryptedStorage();
    }
    return storagePromise;
  };

  return {
    getItem: async (name: string): Promise<string | null> => {
      const storage = await getStorage();
      return storage.getItem(name);
    },

    setItem: async (name: string, value: string): Promise<void> => {
      const storage = await getStorage();
      return storage.setItem(name, value);
    },

    removeItem: (name: string): void => {
      // removeItem is synchronous, so we just delegate to localStorage directly
      localStorage.removeItem(name);
    },
  };
}
