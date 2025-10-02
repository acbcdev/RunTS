import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      registerType: "prompt",
      injectRegister: "auto",
      manifest: {
        name: "Runts",
        short_name: "Runts",
        description: "Typescript playground with themes ",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      // devOptions: {
      //   enabled: true,
      //   navigateFallbackAllowlist: [/^\//],
      // },
      workbox: {
        navigateFallback: "/",
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 8,
        globPatterns: ["**/*.{js,css,html,woff2}", "**/*.{png,jpg,svg,webp}"],
      },
    }),
    tailwindcss(),
  ],
  worker: {
    format: "es",
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@features": path.resolve("./src/features"),
    },
  },
});
