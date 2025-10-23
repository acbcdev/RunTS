/**
 * Platform detection utilities
 * Uses userAgent and userAgentData with regex for robust cross-browser detection
 */

/**
 * Detects if the current operating system is macOS
 * Uses userAgent as primary method with userAgentData as modern fallback
 * @returns true if running on macOS, false otherwise
 */
export const isMac = (): boolean => {
  // Check userAgent first (most compatible)
  if (typeof navigator.userAgent !== "undefined") {
    const macRegex = /(mac|macintosh|iphone|ipad)/i;
    return macRegex.test(navigator.userAgent);
  }

  // Check userAgentData (modern API)
  if ("userAgentData" in navigator && navigator.userAgentData) {
    const platform = (navigator.userAgentData as { platform?: string })
      .platform;
    return Boolean(platform && /mac/i.test(platform));
  }

  return false;
};

/**
 * Detects if the current operating system is Windows
 * Uses userAgent as primary method with userAgentData as modern fallback
 * @returns true if running on Windows, false otherwise
 */
export const isWindows = (): boolean => {
  // Check userAgent first (most compatible)
  if (typeof navigator.userAgent !== "undefined") {
    const winRegex = /(win|windows)/i;
    return winRegex.test(navigator.userAgent);
  }

  // Check userAgentData (modern API)
  if ("userAgentData" in navigator && navigator.userAgentData) {
    const platform = (navigator.userAgentData as { platform?: string })
      .platform;
    return Boolean(platform && /win/i.test(platform));
  }

  return false;
};

/**
 * Detects if the current operating system is Linux
 * Uses userAgent as primary method with userAgentData as modern fallback
 * @returns true if running on Linux, false otherwise
 */
export const isLinux = (): boolean => {
  // Check userAgent first (most compatible)
  if (typeof navigator.userAgent !== "undefined") {
    const linuxRegex = /(linux|x11)/i;
    const androidDesktopRegex = /android(?!.*mobile)/i;
    return (
      linuxRegex.test(navigator.userAgent) ||
      androidDesktopRegex.test(navigator.userAgent)
    );
  }

  // Check userAgentData (modern API)
  if ("userAgentData" in navigator && navigator.userAgentData) {
    const platform = (navigator.userAgentData as { platform?: string })
      .platform;
    return Boolean(platform && /linux/i.test(platform));
  }

  return false;
};

/**
 * Gets the appropriate modifier key symbol for the current platform
 * @returns "⌘" for macOS, "Ctrl" for Windows/Linux
 */
export const getModifierKey = (): string => {
  return isMac() ? "⌘" : "Ctrl";
};

/**
 * Detects if the app is running as a Progressive Web App (PWA)
 * @returns true if running in PWA mode, false otherwise
 */
export const isPWA = (): boolean => {
  // Check for standalone mode (PWA indicator)
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // Check for iOS standalone mode
  if ("standalone" in navigator && navigator.standalone === true) {
    return true;
  }

  return false;
};
